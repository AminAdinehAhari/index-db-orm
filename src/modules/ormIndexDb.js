"use strict";
import textMessage from "./helper/textMessage";
import configs from "./helper/configs";

class OrmIndexDb {

    IDB = null;
    IDBTransaction = null;
    IDBKeyRange = null;
    __isSupport = false;
    __schema = {};


    constructor() {
        try {
            this.checkBrowserSupport();
        } catch (e) {
        }
    }

    // Support Functions ------------------------
    //-------------------------------------------

    checkBrowserSupport() {
        this.IDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
        this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        if (!!!this.IDB) {
            this.__isSupport = false;
            console.error(textMessage.ErrorBrowserSupport);
            throw textMessage.ErrorBrowserSupport;
        } else {
            this.__isSupport = true;
        }
    }

    checkSupport() {
        if (!this.__isSupport) {
            throw textMessage.ErrorBrowserSupport;
        }
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------


    // DB Functional ----------------------------
    // Public -----------------------------------

    async getAllDatabases() {
        try {
            return await this.IDB.databases();
        } catch (e) {
            return [];
        }
    }

    async getDataBase(name) {
        try {
            let all = await this.getAllDatabases();
            return all.find(it => it.name === name);
        } catch (e) {
            return e
        }
    };

    async getDataBaseVersion(name) {
        try {
            let dataBase = await this.getDataBase(name);
            if (!!dataBase) {
                return dataBase.version;
            } else {
                return 1;
            }
        } catch (e) {
            return 1;
        }
    }

    async removeAllDataBase() {
        let DB = await this.getAllDatabases();
        for (let i = 0; i < DB.length; i++) {
            await this.removeDataBase(DB[i].name)
        }
        return this;
    }

    async removeDataBase(dataBaseName) {
        try {
            await this.IDB.deleteDatabase(dataBaseName);
            return this;
        } catch (e) {
            return this;
        }
    }


    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------


    // DB Object Functions ----------------------
    // Public -----------------------------------

    addDB(dbSchema) {
        const stores = {};

        for (let i = 0; i < dbSchema.stores.length; i++) {
            let res = this._createStoreObjectSchema(dbSchema.stores[i]);
            if (!!res) {
                stores[res?.name] = res;
            }
        }

        this.__schema[dbSchema.name] = {
            version: 1,
            currentVersion: 1,
            db: null,
            name: dbSchema.name,
            onRebuild: dbSchema?.onRebuild,
            isBuild: false,
            stores: stores
        };
        return this;
    }

    onRebuildDB(dbName, event) {
        this.__schema[dbName].onRebuild = event;
        return this;
    }

    // Private ----------------------------------

    _openDB(name) {
        const version = Math.max(this.__schema[name].version, this.__schema[name].currentVersion);

        return new Promise((resolve, reject) => {
            this.checkSupport();
            try {
                const request = this.IDB.open(name, version);

                request.onerror = event => {
                    reject(version, event.target?.error);
                };

                request.onsuccess = event => {
                    const db = event.target.result;
                    this.__schema[name].db = event.target.result;
                    this.__schema[name].version = parseInt(db.version);
                    resolve({type: 'success', db: db});
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    this.__schema[name].db = event.target.result;
                    this.__schema[name].version = parseInt(db.version);
                    resolve({type: 'upgrade', db: db});
                }

            } catch (e) {
                reject(e);
            }

        });
    }

    _closeDB(name) {
        return new Promise((resolve, reject) => {
            try {
                this.__schema[name].db?.close();
                this.__schema[name].db = null;
                resolve()
            } catch (e) {
                reject(e)
            }

        });
    }

    _rebuildDBEvent(name) {
        if (this.__schema[name].isBuild) {
            const ev = this.__schema[name].onRebuild;
            if (!!ev) {
                ev();
                this.__schema[name].isBuild = false;
            }
        }
    }

    // Store Functions --------------------------
    // Public -----------------------------------

    async clearStore(dbName, storeName) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.clear();

                request.onsuccess = event => {
                    resolve(true)
                };

                request.onerror = event => {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })
    }


    // Private ----------------------------------

    _createStoreObjectSchema(storeSchema) {
        if (!!storeSchema.name) {
            const keyPath = !!storeSchema.keyPath ? storeSchema.keyPath : configs.KEY_PATH;

            return {
                name: storeSchema.name,
                keyPath: keyPath,
                keyPathAuto: !!!storeSchema.keyPath,
                indexes: !!storeSchema.indexes && Array.isArray(storeSchema.indexes) ?
                    this._createIndexesArray(storeSchema.indexes, keyPath) :
                    this._createIndexesArray([], keyPath),
            }
        } else {
            return null;
        }
    }

    async _createDbStores(dbName) {
        try {

            let stores = this.__schema[dbName].stores;
            let start = true;
            for (let i in stores) {

                if (!start) {
                    this.__schema[dbName].version = this.__schema[dbName].version + 1;
                }
                start = false;

                if (!!!this.__schema[dbName].db) {
                    await this._openDB(dbName);
                }

                await this._createDbStore(dbName, i);
                await this._closeDB(dbName);

            }

            this.__schema[dbName].isBuild = true;

            return this;
        } catch (e) {
            console.error(e);
            return e
        }
    }

    _createDbStore(dbName, storeName) {
        return new Promise((resolve, reject) => {
            try {

                let store = this.__schema[dbName].stores[storeName];
                let db = this.__schema[dbName].db;

                if (!!db) {

                    let objectStore = db.createObjectStore(store.name, {autoIncrement: true, keyPath: store.keyPath});
                    this._buildStoreIndexes(objectStore, store.indexes);

                    objectStore.transaction.oncomplete = event => {
                        resolve(true);
                    };

                    objectStore.transaction.onerror = event => {
                        reject(event.error)
                    };

                } else {
                    reject(new Error(textMessage.ErrorDataBaseNotOpened))
                }

            } catch (e) {
                reject(e);
            }
        });
    }


    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // Index Functions --------------------------
    // Public -----------------------------------

    // Private ----------------------------------

    _createIndexesArray(indexesArr, keyPath) {
        let indexes = indexesArr.map(it => {
            return this._createIndexObject(it.name, it.keyPath, it.option)
        });

        return [
            this._createIndexObject(configs.KEY_PATH, keyPath, {unique: true}),
            ...indexes,
        ].filter(it => !!it);
    }

    _createIndexObject(name, keyPath, option = {unique: false}) {
        if (!!name && !!keyPath) {
            return {
                name: name,
                keyPath: keyPath,
                option: !!option ? option : {unique: false}
            }
        } else {
            return null;
        }
    }

    _buildStoreIndexes(storeObject, arrayIndexObj) {
        for (let i = 0; i < arrayIndexObj.length; i++) {
            this._buildStoreIndex(storeObject, arrayIndexObj[i]);
        }
    }

    _buildStoreIndex(storeObject, indexObj) {
        storeObject.createIndex(indexObj.name, indexObj.keyPath, indexObj.option);
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // CRUD Functions ---------------------------
    // Public -----------------------------------

    async insert(dbName, storeName, data) {

        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                const newData = this._insertConvertDataEntry(dbName, storeName, data);

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.add(newData);
                let ths = this;

                request.onsuccess = function (event) {
                    let req = event.target;
                    if (!!req.error) {
                        reject(req.error);
                    } else if (!!req.result) {
                        resolve(ths.find(dbName, storeName, req.result))
                    } else {
                        reject(new Error(textMessage.ErrorSystem))
                    }
                };
                request.onerror = function (event) {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })

    }

    async update(dbName, storeName, data) {

        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let storeObj = this.__schema[dbName].stores[storeName];
                let storeKeyPath = storeObj.keyPath;
                const _pk = data[storeKeyPath];
                const newData = this._updateConvertDataEntry(dbName, storeName, data);

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.get(_pk);
                let ths = this;


                request.onsuccess = event => {

                    const dt = event.target.result;
                    let requestUpdate = transaction?.put(newData);

                    requestUpdate.onerror = ev => {
                        let req = ev.target;
                        reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                    };
                    requestUpdate.onsuccess = ev => {
                        let req = ev.target;
                        if (!!req.error) {
                            reject(req.error);
                        } else if (!!req.result) {
                            resolve(ths.find(dbName, storeName, req.result))
                        } else {
                            reject(new Error(textMessage.ErrorSystem))
                        }
                    };
                };

                request.onerror = event => {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })


    }

    async delete(dbName, storeName, _pk) {

        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.delete(_pk);

                request.onsuccess = event => {
                    resolve(true);
                };

                request.onerror = function (event) {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })


    }

    async find(dbName, storeName, value, searchPk = null) {
        return new Promise(async (resolve, reject) => {
            try {

                const keyRangeValue = this.IDBKeyRange.only(value);
                let result = null;

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let storeObj = this.__schema[dbName].stores[storeName];
                let storeKeyPath = storeObj.keyPath;

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                let myIndex = transaction.index(!!searchPk ? searchPk : storeKeyPath);
                const getCursorRequest = myIndex.openCursor(keyRangeValue);

                getCursorRequest.onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor && !!!result) {
                        result = cursor.value;
                        cursor.continue();
                    } else {
                        resolve(result)
                    }
                };

                getCursorRequest.onerror = function (event) {
                    console.error(event.error);
                    resolve(null);
                };


            } catch (e) {
                resolve(null);
            }
        })
    }

    async all(dbName, storeName) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                let request = transaction?.getAll();

                request.onsuccess = event => {
                    const dt = event.target.result;
                    resolve(dt)
                };

                request.onerror = event => {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })
    }

    async where(dbName, storeName, conditionIndex, conditionOperator, conditionValues) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let keyRangeValue = null;
                let result = [];

                const cursorConditionOperator = ['like', '%like', 'like%', '%like%','match'];

                switch (conditionOperator) {
                    case "=":
                        keyRangeValue = this.IDBKeyRange?.only(conditionValues);
                        break;
                    case ">":
                        keyRangeValue = this.IDBKeyRange?.lowerBound(conditionValues, false);
                        break;
                    case ">=":
                        keyRangeValue = this.IDBKeyRange?.lowerBound(conditionValues, true);
                        break;
                    case "<":
                        keyRangeValue = this.IDBKeyRange?.upperBound(conditionValues, false);
                        break;
                    case "<=":
                        keyRangeValue = this.IDBKeyRange?.upperBound(conditionValues, true);
                        break;
                    case "between":
                        keyRangeValue = this.IDBKeyRange?.bound(...conditionValues, false, false);
                        break;
                    case "betweenInclude":
                        keyRangeValue = this.IDBKeyRange?.bound(...conditionValues, true, true);
                        break;
                    default :
                        keyRangeValue = null;
                        break;
                }

                if (!!keyRangeValue) {

                    let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                    let myIndex = transaction.index(conditionIndex);
                    const getCursorRequest = myIndex.openCursor(keyRangeValue);

                    getCursorRequest.onsuccess = function (event) {
                        const cursor = event.target.result;
                        if (cursor) {
                            result.push(cursor.value);
                            cursor.continue();
                        } else {
                            resolve(result)
                        }
                    };

                    getCursorRequest.onerror = function (event) {
                        console.error(event.error);
                        resolve([]);
                    };


                } else if (cursorConditionOperator.includes(conditionOperator)) {

                    const conditionStringValue = !!conditionValues && typeof conditionValues !== 'object' ? conditionValues.toString() : null;

                    if (!!conditionStringValue) {

                        let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        const getCursorRequest = transaction.openCursor();

                        getCursorRequest.onsuccess = function (event) {
                            const cursor = event.target.result;
                            if (!!cursor && !!cursor.value) {

                                let searchValue = !!cursor.value[conditionIndex] ?
                                    cursor.value[conditionIndex] : "";


                                if (conditionOperator === 'like' || conditionOperator === '%like%') {
                                    let re = new RegExp(`^(.*){0,}${conditionStringValue}(.*){0,}$`, 'i');

                                    if (!!searchValue && searchValue.match(re)) {
                                        result.push(cursor.value);
                                    }

                                } else if (conditionOperator === '%like') {
                                    let re = new RegExp(`^(.*){0,}${conditionStringValue}$`, 'i');

                                    if (!!searchValue && searchValue.match(re)) {
                                        result.push(cursor.value);
                                    }
                                } else if (conditionOperator === 'like%') {
                                    let re = new RegExp(`^${conditionStringValue}(.*){0,}$`, 'i');

                                    if (!!searchValue && searchValue.match(re)) {
                                        result.push(cursor.value);
                                    }
                                } else if (conditionOperator === 'match') {
                                    let re = new RegExp(conditionStringValue, 'i');

                                    if (!!searchValue && searchValue.match(re)) {
                                        result.push(cursor.value);
                                    }
                                }

                                cursor.continue();
                            } else {
                                resolve(result)
                            }
                        };


                        getCursorRequest.onerror = function (event) {
                            console.error(event.error);
                            resolve([]);
                        };

                    } else {
                        resolve([]);
                    }

                } else {
                    resolve([]);
                }

            } catch (e) {
                resolve([]);
            }
        })
    }

    async multiWhere(dbName, storeName, conditions = [], operator = 'and') {
        try {
            let conditionList = Array.isArray(conditions) ? conditions : [];
            let result = [];
            let cacheKeys = [];
            let cacheResult;
            let storeObject = this.__schema[dbName].stores[storeName];
            let keyPath = storeObject?.keyPath;

            for (let i = 0; i < conditionList.length; i++) {
                if (!!conditionList[i].index && !!conditionList[i].operator && !!conditionList[i].value) {
                    try {
                        cacheResult = await this.where(dbName, storeName, conditionList[i].index, conditionList[i].operator, conditionList[i].value);
                    } catch (e) {
                        cacheResult = [];
                    }

                    if (i === 0) {
                        result = cacheResult;
                    } else {
                        if (operator === 'or') {
                            result = [
                                ...result,
                                ...cacheResult
                            ];
                        } else {
                            cacheKeys = cacheResult.map(it => it[keyPath]);
                            result = result.filter(it => {
                                return cacheKeys.includes(it[keyPath])
                            });

                            if (result.length === 0) {
                                break;
                            }
                        }

                    }
                }
            }

            if (operator === 'or') {
                return [...new Map(result.map(item =>
                    [item[keyPath], item])).values()];
            } else {
                return result;
            }


        } catch (e) {
            console.log(e);
            return [];
        }
    }

    // private ---------------------------------

    _generatePkIndexValue() {
        let rand = Math.ceil(9 * Math.random());
        return Date.now() + '0' + rand;
    }

    _insertConvertDataEntry(dbName, storeName, data) {

        const store = this.__schema[dbName].stores[storeName];
        const keyPath = store.keyPath;

        let newData = data;

        // primary key check ------------
        //-------------------------------
        if (store.keyPathAuto) {
            if (!(keyPath in newData)) {
                newData[keyPath] = this._generatePkIndexValue();
            }
        }

        return newData;
    }

    _updateConvertDataEntry(dbName, storeName, data) {

        const store = this.__schema[dbName].stores[storeName];
        const keyPath = store.keyPath;

        return data;
    }

    _transactionReadOnly(dbName, storeName) {
        const dbObj = this.__schema[dbName];
        const db = dbObj.db;

        return db?.transaction(storeName, configs.READ_ONLY);
    }

    _transactionReadWrite(dbName, storeName) {
        const dbObj = this.__schema[dbName];
        const db = dbObj.db;

        return db.transaction(storeName, configs.READ_WRITE);
    }

    _checkActiveDB(dbName) {
        let dbObj = this.__schema[dbName];
        let db = dbObj.db;
        return !!db
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // ORM Operation Functions ------------------
    // Public -----------------------------------

    async build() {

        return new Promise(async (resolve, reject) => {
            try {
                for (let i in this.__schema) {
                    try {
                        await this._setCurrentVersionOnSchema(i);

                        let res = await this._openDB(i);
                        if (res?.type === 'upgrade') {
                            await this._createDbStores(i);
                        }

                        let status = await this._compareStoresToVersionChange(i);

                        if (!status) {
                            try {
                                await this._rebuildDB(i);
                            } catch (e) {
                                console.error(e)
                            }
                        }

                        this._addDataBaseToClass(i)

                    } catch (e) {
                    }
                }

                resolve(this);

                setTimeout(() => {
                    for (let i in this.__schema) {
                        this._rebuildDBEvent(i);
                    }
                }, 20);

            } catch (e) {
                reject(e);
            }
        })
    }

    // Private ----------------------------------

    _compareStoresToVersionChange(dbName) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!!!this.__schema[dbName].db) {
                    await this._openDB(dbName)
                }

                let dbObject = this.__schema[dbName];
                let stores = dbObject.stores;

                const orgStores = [...dbObject.db.objectStoreNames];

                let status = true;

                for (let i in stores) {
                    if (!orgStores.includes(i)) {
                        console.error(`not found store "${i}" in "${dbName}" database`)
                    }
                    status = status && orgStores.includes(i);
                }

                resolve(status)
            } catch (e) {
                console.error(e);
                resolve(false)
            }
        });


    }

    _rebuildDB(dbName) {
        return new Promise(async (resolve, reject) => {
            try {
                await this._closeDB(dbName);
                await this.removeDataBase(dbName);
                let res = await this._openDB(dbName);
                if (res?.type === 'upgrade') {
                    await this._createDbStores(dbName);
                }
                resolve(true)
            } catch (e) {
                reject(e)
            }
        });
    }

    _setCurrentVersionOnSchema(dbName) {
        return new Promise(async (resolve, reject) => {
            try {
                this.__schema[dbName].currentVersion = await this.getDataBaseVersion(dbName);

                resolve(1);
            } catch (e) {
                resolve(1);
            }
        })
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    _addDataBaseToClass(db) {
        let dbObj = {};

        for (let j in this.__schema[db].stores) {
            dbObj[j] = {
                ...this.__schema[db].stores[j],
                ...this._addDataBaseHandler(db, j)
            }
        }

        this[db] = dbObj;
    }

    _addDataBaseHandler(dbName, storeName) {

        let ths = this;

        return {
            insert: function (data) {
                return ths.insert(dbName, storeName, data)
            },
            update: function (data) {
                return ths.update(dbName, storeName, data)
            },
            delete: function (_pk) {
                return ths.delete(dbName, storeName, _pk)
            },
            find: function (value, searchPk = null) {
                return ths.find(dbName, storeName, value, searchPk)
            },
            all: function () {
                return ths.all(dbName, storeName)
            },
            where: function (conditionIndex, conditionOperator, conditionValues) {
                return ths.where(dbName, storeName, conditionIndex, conditionOperator, conditionValues)
            },
            multiWhere: function(conditions){
                return ths.multiWhere(dbName, storeName, conditions)
            },
            clear: function () {
                return ths.clearStore(dbName, storeName)
            },
        }
    }

}


export default OrmIndexDb;
