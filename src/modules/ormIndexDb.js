"use strict";
import textMessage from "./helper/textMessage";
import configs from "./helper/configs";

const fakerIDB = require("fake-indexeddb");
const fakerIDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
const fakerIDBTransaction = require("fake-indexeddb/lib/FDBTransaction");

class OrmIndexDb {

    IDB = null;
    IDBTransaction = null;
    IDBKeyRange = null;
    __isSupport = false;
    __schema = {};
    __mode = 'product';


    /**
     * constructor : check Browser Support
     */
    constructor(mode = 'product') {
        this.__mode = mode;
        try {
            this.checkBrowserSupport();
        } catch (e) {
        }
    }

    // Support Functions ------------------------
    //-------------------------------------------

    /**
     * checkBrowserSupport
     */
    checkBrowserSupport() {
        if (this.__mode === 'test') {
            this.IDB = fakerIDB;
            this.IDBTransaction = fakerIDBTransaction;
            this.IDBKeyRange = fakerIDBKeyRange;
        } else {
            this.IDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
            this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        }


        if (!!!this.IDB) {
            this.__isSupport = false;
            console.error(textMessage.ErrorBrowserSupport);
            throw textMessage.ErrorBrowserSupport;
        } else {
            this.__isSupport = true;
        }
    }

    /**
     * checkSupport
     */
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

    /**
     * getAllDatabases
     * @returns {Promise<array>}
     */
    async getAllDatabases() {
        try {
            return await this.IDB.databases();
        } catch (e) {
            return [];
        }
    }

    /**
     * getDataBase
     * @param {String} name
     * @returns {Promise<Object>}
     */
    async getDataBase(name) {
        try {
            let all = await this.getAllDatabases();
            return all.find(it => it.name === name);
        } catch (e) {
            return e
        }
    };

    /**
     * getDataBaseVersion
     * @param {string} name
     * @returns {Promise<number|*>}
     */
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

    /**
     * removeAllDataBase
     * @returns {Promise<OrmIndexDb>}
     */
    async removeAllDataBase() {
        let DB = await this.getAllDatabases();
        for (let i = 0; i < DB.length; i++) {
            await this.removeDataBase(DB[i].name)
        }
        return this;
    }

    /**
     * removeDataBase
     * @param {string} dataBaseName
     * @returns {Promise<OrmIndexDb|error>}
     */
    async removeDataBase(dataBaseName) {
        try {
            await this.IDB.deleteDatabase(dataBaseName);
            this._removeDataBaseOfSchema(dataBaseName);
            this._removeDataBaseOfClass(dataBaseName);
            return this;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // Private -----------------------------------

    /**
     * _removeDataBaseOfSchema
     * @param {string} dataBaseName
     * @returns {Error|OrmIndexDb}
     * @private
     */
    _removeDataBaseOfSchema(dataBaseName) {
        try {
            delete this.__schema[dataBaseName];
            return this;
        } catch (error) {
            return error;
        }
    }

    /**
     * _removeDataBaseOfClass
     * @param {string} dataBaseName
     * @returns {Error|OrmIndexDb}
     * @private
     */
    _removeDataBaseOfClass(dataBaseName) {
        try {
            delete this[dataBaseName];
            return this;
        } catch (error) {
            return error;
        }
    }


    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // DB Object Functions ----------------------
    // Public -----------------------------------

    /**
     *
     * @param {Object} dbSchema
     * @returns {OrmIndexDb}
     * exp dbSchema :
     * {
     *       name: String,
     *       stores: [
     *           ...,
     *           {
     *               name: string,
     *               indexes: [
     *                  ....
     *                  {
     *                      name : string,
     *                      keyPath : string ,
     *                      option : { unique : boolean}
     *                  }
     *                  ....
     *               ]
     *           },
     *           ....
     *       ]
     *   }
     *
     */
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

    /**
     *
     * @param {string} dbName
     * @param {function} event
     * @returns {OrmIndexDb}
     */
    onRebuildDB(dbName, event) {
        this.__schema[dbName].onRebuild = event;
        return this;
    }

    // Private ----------------------------------

    /**
     * _openDB
     * @param {string} name
     * @returns {Promise<object>}
     * @private
     */
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

    /**
     * _closeDB
     * @param {string} name
     * @returns {Promise<*>}
     * @private
     */
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

    /**
     * _rebuildDBEvent
     * @param {string} name
     * @private
     */
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

    /**
     * clearStore
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<boolean|*>}
     */
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

    /**
     * _createStoreObjectSchema
     * @param {string} storeSchema
     * @returns {null|{indexes: (*), keyPath: string, name: *, keyPathAuto: boolean}}
     * @private
     */
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

    /**
     * _createDbStores
     * @param {string} dbName
     * @returns {Promise<*|OrmIndexDb>}
     * @private
     */
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

    /**
     * _createDbStore
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<boolean|error>}
     * @private
     */
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

    /**
     * _createIndexesArray
     * @param {array<Object>} indexesArr
     * @param {string} keyPath
     * @returns {array<object>}
     * @private
     */
    _createIndexesArray(indexesArr, keyPath) {
        let indexes = indexesArr.map(it => {
            return this._createIndexObject(it.name, it.keyPath, it.option)
        });

        return [
            this._createIndexObject(configs.KEY_PATH, keyPath, {unique: true}),
            ...indexes,
        ].filter(it => !!it);
    }

    /**
     *_createIndexObject
     * @param {string} name
     * @param {string} keyPath
     * @param {Object} option
     * @returns {{keyPath: *, name: *, option: ({unique: boolean})}|null}
     * @private
     */
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

    /**
     * _buildStoreIndexes
     * @param {string} storeObject
     * @param {array} arrayIndexObj
     * @private
     */
    _buildStoreIndexes(storeObject, arrayIndexObj) {
        for (let i = 0; i < arrayIndexObj.length; i++) {
            this._buildStoreIndex(storeObject, arrayIndexObj[i]);
        }
    }

    /**
     * _buildStoreIndex
     * @param {Object} storeObject
     * @param {Object} indexObj
     * @private
     */
    _buildStoreIndex(storeObject, indexObj) {
        storeObject.createIndex(indexObj.name, indexObj.keyPath, indexObj.option);
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // CRUD Functions ---------------------------
    // Public -----------------------------------

    /**
     * insert
     * @param {string} dbName
     * @param {string} storeName
     * @param {Object} data
     * @returns {Promise<Error|Object>}
     */
    insert(dbName, storeName, data) {
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
                        resolve(ths.find(dbName, storeName, req.result,configs.KEY_PATH))
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

    /**
     * update
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} data
     * @returns {Promise<Error|Object>}
     */
    update(dbName, storeName, data) {

        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                const _pk = data[configs.KEY_PATH];

                const newData = this._updateConvertDataEntry(dbName, storeName, data);

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.get(_pk);
                let ths = this;


                request.onsuccess = event => {

                    // const dt = event.target.result;
                    let requestUpdate = transaction?.put(newData);

                    requestUpdate.onerror = ev => {
                        let req = ev.target;
                        reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                    };
                    requestUpdate.onsuccess = async ev => {
                        let req = ev.target;

                        if (!!req.error) {
                            reject(req.error);
                        } else if (!!req.result) {
                            let find_res = await ths.find(dbName, storeName, req.result, configs.KEY_PATH);
                            resolve(find_res)
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

    /**
     * delete
     * @param {string} dbName
     * @param {string} storeName
     * @param {string|number} _pk
     * @returns {Promise<Error|boolean>}
     */
    delete(dbName, storeName, _pk) {

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

    /**
     * find
     * @param {string} dbName
     * @param {string} storeName
     * @param {string|number} value
     * @param {string} searchPk
     * @returns {Promise<object>}
     */
    find(dbName, storeName, value, searchPk = null) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let skp = !!searchPk ? searchPk : configs.KEY_PATH;

                const keyRangeValue = this.IDBKeyRange.only(value);
                let result = null;

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                let myIndex = transaction.index(skp);
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

    /**
     * all
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<array>}
     */
    all(dbName, storeName) {
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

    /**
     * where
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} conditionIndex
     * @param {string} conditionOperator includes : = , > , >= , <= , < ,  between , betweenInclude , like , %like , like% , %like% , match
     * @param {number|string|array} conditionValues
     * @returns {Promise<array>}
     */
    where(dbName, storeName, conditionIndex, conditionOperator, conditionValues) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let keyRangeValue = null;
                let result = [];

                const cursorConditionOperator = ['like', '%like', 'like%', '%like%', 'match'];

                switch (conditionOperator) {
                    case "=":
                        keyRangeValue = this.IDBKeyRange?.only(conditionValues);
                        break;
                    case ">":
                        keyRangeValue = this.IDBKeyRange?.lowerBound(conditionValues, true);
                        break;
                    case ">=":
                        keyRangeValue = this.IDBKeyRange?.lowerBound(conditionValues, false);
                        break;
                    case "<":
                        keyRangeValue = this.IDBKeyRange?.upperBound(conditionValues, true);
                        break;
                    case "<=":
                        keyRangeValue = this.IDBKeyRange?.upperBound(conditionValues, false);
                        break;
                    case "between":
                        keyRangeValue = this.IDBKeyRange?.bound(...conditionValues, true, true);
                        break;
                    case "betweenInclude":
                        keyRangeValue = this.IDBKeyRange?.bound(...conditionValues, false, false);
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

                        let keyPaths = this._getStoreIndexKeyPaths(dbName,storeName,conditionIndex);


                        let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        const getCursorRequest = transaction.openCursor();

                        getCursorRequest.onsuccess = function (event) {
                            const cursor = event.target.result;

                            if (!!cursor && !!cursor.value) {

                                let searchValues = keyPaths.map(kp=>{
                                    return {
                                        value : !!cursor.value[kp] ? cursor.value[kp] : "",
                                        result : false
                                    };
                                });


                                if (conditionOperator === 'like' ||
                                    conditionOperator === '%like%' ||
                                    conditionOperator === '%like' ||
                                    conditionOperator === 'like%' ||
                                    conditionOperator === 'match'
                                ){
                                    let re = null;
                                    switch (conditionOperator) {
                                        case "%like":
                                            re = new RegExp(`^(.*){0,}${conditionStringValue}$`, 'i');
                                            break;
                                        case "%like%":
                                            re = new RegExp(`^(.*){0,}${conditionStringValue}(.*){0,}$`, 'i');
                                            break;
                                        case "like":
                                            re = new RegExp(`^(.*){0,}${conditionStringValue}(.*){0,}$`, 'i');
                                            break;
                                        case "like%":
                                            re = new RegExp(`^${conditionStringValue}(.*){0,}$`, 'i');
                                            break;
                                        case "match":
                                            re = new RegExp(conditionStringValue, 'i');
                                            break;
                                        default:
                                            re = null;
                                            break;
                                    }

                                    let resultShare = searchValues.map(it=>{
                                        return {
                                            ...it,
                                            result : !!it.value && !!re && !!it.value.match(re)
                                        }
                                    }).reduce((res,it)=>{
                                        return res && it.result
                                    },true);

                                    if (resultShare){
                                        result.push(cursor.value);
                                    }

                                }else{

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

    /**
     * multiWhere
     * @param {string} dbName
     * @param {string} storeName
     * @param {array} conditions
     * @param {string} operator
     * @returns {Promise<array>}
     */
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


        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // private ---------------------------------

    /**
     * _generatePkIndexValue
     * @returns {string}
     * @private
     */
    _generatePkIndexValue() {
        let rand = Math.ceil(9 * Math.random());
        return Date.now() + '0' + rand;
    }

    /**
     * _insertConvertDataEntry
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} data
     * @returns {object}
     * @private
     */
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

        newData[configs.KEY_PATH] = newData[keyPath];

        return newData;
    }

    /**
     * _updateConvertDataEntry
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} data
     * @returns {object}
     * @private
     */
    _updateConvertDataEntry(dbName, storeName, data) {

        const store = this.__schema[dbName].stores[storeName];
        const keyPath = store.keyPath;

        return data;
    }

    /**
     * _transactionReadOnly
     * @param {string} dbName
     * @param {string} storeName
     * @returns {IDBTransaction}
     * @private
     */
    _transactionReadOnly(dbName, storeName) {
        const dbObj = this.__schema[dbName];
        const db = dbObj.db;

        return db?.transaction(storeName, configs.READ_ONLY);
    }

    /**
     * _transactionReadWrite
     * @param {string} dbName
     * @param {string} storeName
     * @returns {IDBTransaction}
     * @private
     */
    _transactionReadWrite(dbName, storeName) {
        const dbObj = this.__schema[dbName];
        const db = dbObj.db;

        return db.transaction(storeName, configs.READ_WRITE);
    }

    /**
     * _checkActiveDB
     * @param {string} dbName
     * @returns {boolean}
     * @private
     */
    _checkActiveDB(dbName) {
        let dbObj = this.__schema[dbName];
        let db = dbObj.db;
        return !!db
    }

    _getStoreIndexKeyPaths(dbName,storeName,indexName){
        const indexesArray = this.__schema[dbName]?.stores[storeName]?.indexes;

        if (!!indexesArray){
            let indexObj = indexesArray.find(it=>{
                return it.name === indexName
            });

            if (!!indexObj){
                if (!!indexObj.keyPath){
                    if (Array.isArray(indexObj.keyPath)){
                        return indexObj.keyPath
                    }else{
                        return [indexObj.keyPath]
                    }
                }else{
                    return [];
                }
            }else{
                return [];
            }

        }else{
            return [];
        }
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // ORM Operation Functions ------------------
    // Public -----------------------------------

    /**
     * build
     * @returns {Promise<OrmIndexDb>}
     */
    build() {

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

                for (let i in this.__schema) {
                    this._rebuildDBEvent(i);
                }
                resolve(this);

            } catch (e) {
                reject(e);
            }
        })
    }

    // Private ----------------------------------

    /**
     * _compareStoresToVersionChange
     * @param {string} dbName
     * @returns {Promise<boolean>}
     * @private
     */
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

    /**
     * _rebuildDB
     * @param {string} dbName
     * @returns {Promise<boolean|Error>}
     * @private
     */
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

    /**
     * _setCurrentVersionOnSchema
     * @param dbName
     * @returns {Promise<number>}
     * @private
     */
    _setCurrentVersionOnSchema(dbName) {
        return new Promise(async (resolve, reject) => {
            try {
                this.__schema[dbName].currentVersion = await this.getDataBaseVersion(dbName);
                resolve(this.__schema[dbName].currentVersion);
            } catch (e) {
                resolve(1);
            }
        })
    }

    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    /**
     * _addDataBaseToClass
     * @param {string} dbName
     * @private
     */
    _addDataBaseToClass(dbName) {
        let dbObj = {};

        for (let j in this.__schema[dbName].stores) {
            dbObj[j] = {
                ...this.__schema[dbName].stores[j],
                ...this._addDataBaseHandler(dbName, j)
            }
        }

        this[dbName] = dbObj;
    }

    /**
     * _addDataBaseHandler
     * @param {string} dbName
     * @param {string} storeName
     * @returns {object}
     * @private
     */
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
            multiWhere: function (conditions,operator = 'and') {
                return ths.multiWhere(dbName, storeName, conditions , operator)
            },
            clear: function () {
                return ths.clearStore(dbName, storeName)
            },
        }
    }

}


export default OrmIndexDb;
