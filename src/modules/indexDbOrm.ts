"use strict";
import textMessage from "./helper/textMessage";
import configs from "./helper/configs";
import {indexDbOrmInterface, whereObjectiveInterface, whereCondition,dataBaseHandlerInterface} from "./interface/indexDbOrmInterface";
import {dbInterface} from "./interface/dbInterface";
import {schemasInterface} from "./interface/schemasInterface";
import {schemaEnterInterface} from "./interface/schemaInterface";
import {storeInterface} from "./interface/storeInterface";
import {indexInterface} from "./interface/indexInterface";
import {openDbInterface} from "./interface/openDbInterface";
import {transactionInterface} from "./interface/transactionInterface";
import {idbKeyRangeInterface} from "./interface/idbKeyRangeInterface";
import {storeObjectiveInterface} from "./interface/storeObjectiveInterface";

const ormDBName: string = "___orm";
const ormStorePagination: string = "paginate";



class indexDbOrm implements indexDbOrmInterface{

    IDB: any = null;
    IDBTransaction: any = null;
    IDBKeyRange: idbKeyRangeInterface = null;
    __schema: schemasInterface = {};
    __mode: string = 'product';

    /**
     * constructor : check Browser Support
     */
    constructor(mode: string = 'product') {
        this.__mode = mode;
        this.checkBrowserSupport();
    }

    // Support Functions ------------------------
    //-------------------------------------------

    /**
     * checkBrowserSupport
     */
    public checkBrowserSupport(): void {
        if (this.__mode === 'test') {
            if (process.env.NODE_ENV !== 'production') {
                const fakerIDB: object = require("fake-indexeddb");
                const fakerIDBKeyRange: idbKeyRangeInterface = require("fake-indexeddb/lib/FDBKeyRange");
                const fakerIDBTransaction: object = require("fake-indexeddb/lib/FDBTransaction");

                this.IDB = fakerIDB;
                this.IDBTransaction = fakerIDBTransaction;
                this.IDBKeyRange = fakerIDBKeyRange;
            }
        } else {
            try {
                this.IDB = window.indexedDB;
                this.IDBTransaction = window.IDBTransaction || {READ_WRITE: "readwrite"};
                // @ts-ignore
                this.IDBKeyRange = window.IDBKeyRange;
            }catch (e) {
                this.IDB = null;
                this.IDBTransaction = null;
                this.IDBKeyRange = null;
            }
        }


        if (!!!this.IDB) {
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
    public async getAllDatabases(): Promise<dbInterface[]> {
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
    public async getDataBase(name: string) : Promise<dbInterface> {
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
    public async getDataBaseVersion(name: string) : Promise<number> {
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
     * @returns {Promise<indexDbOrm>}
     */
    public async removeAllDataBase() : Promise<indexDbOrmInterface> {
        let DB = await this.getAllDatabases();
        for (let i = 0; i < DB.length; i++) {
            await this.removeDataBase(DB[i].name)
        }
        return this;
    }

    /**
     * removeDataBase
     * @param {string} name
     * @returns {Promise<indexDbOrm|error>}
     */
    public async removeDataBase(name: string) : Promise<indexDbOrmInterface>{
        try {
            await this._closeDB(name);
        }catch (e) {}

        try {
            await this.IDB?.deleteDatabase(name);
            await this._timeout(100);
        } catch (error) {
            // return error;
        }

        try {
            this._removeDataBaseOfSchema(name);
            this._removeDataBaseOfClass(name);
            return this;
        }catch (e) {
            return e;
        }
    }

    // Private -----------------------------------

    /**
     * _timeout
     * @param {number} ms
     * @returns {Promise<unknown>}
     * @private
     */
    private _timeout(ms: number) : Promise<any>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * _removeDataBaseOfSchema
     * @param {string} dataBaseName
     * @returns {Error|indexDbOrm}
     * @private
     */
    private _removeDataBaseOfSchema(dataBaseName: string) {
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
     * @returns {Error|indexDbOrm}
     * @private
     */
    private _removeDataBaseOfClass(dataBaseName: string) : indexDbOrmInterface {
        try {
            // @ts-ignore
            delete this[dataBaseName];
            return this;
        } catch (error) {
            return error;
        }
    }

    /**
     * _createDbStores
     * @param {string} dbName
     * @returns {Promise<*|indexDbOrm>}
     * @private
     */
    private async _createDbStores(dbName: string): Promise<indexDbOrmInterface> {
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
                await this._timeout(100);
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
    private _createDbStore(dbName: string, storeName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {

                let store = this.__schema[dbName].stores[storeName];
                let db = this.__schema[dbName].db;

                if (!!db) {

                    let objectStore = db.createObjectStore(store.name, {autoIncrement: true, keyPath: store.keyPath});
                    this._buildStoreIndexes(objectStore, store.indexes);

                    objectStore.transaction.oncomplete = () => {
                        resolve(true);
                    };

                    objectStore.transaction.onerror = (event: { error: any; }) => {
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

    // DB Object Functions ----------------------
    // Public -----------------------------------

    /**
     *
     * @param {Object} dbSchema
     * @returns {indexDbOrm}
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
    public addDB(dbSchema : schemaEnterInterface) : indexDbOrmInterface {
        const stores = {};

        for (let i = 0; i < dbSchema.stores.length; i++) {
            let res = this._createStoreObjectSchema(dbSchema.stores[i]);
            if (!!res) {
                // @ts-ignore
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
     */
    public async allDbClose(): Promise<indexDbOrmInterface>{
        for (let i in this.__schema){
            await this._closeDB(i)
        }
        return this;
    }

    // Private ----------------------------------

    /**
     * _openDB
     * @param {string} name
     * @returns {Promise<object>}
     * @private
     */
    private _openDB(name : string) : Promise<openDbInterface> {
        const version = Math.max(this.__schema[name].version, this.__schema[name].currentVersion);

        return new Promise((resolve, reject) => {
            try {
                const request = this.IDB.open(name, version);


                request.onerror = (event: { target: { error: any; }; }) => {
                    // @ts-ignore
                    reject(version, event.target?.error);
                };

                request.onsuccess = (event: { target: { result: any; }; }) => {
                    const db = event.target.result;
                    this.__schema[name].db = event.target.result;
                    this.__schema[name].version = parseInt(db.version);
                    resolve({type: 'success', db: db});
                };

                request.onupgradeneeded = (event: { target: { result: any; }; }) => {
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
    private _closeDB(name: string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.__schema[name].db?.close();
                this.__schema[name].db = null;
                resolve(true)
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
    private _rebuildDBEvent(name: string) : void {
        if (this.__schema[name].isBuild) {
            const ev = this.__schema[name].onRebuild;

            if (!!ev) {
                ev();
                this.__schema[name].isBuild = false;
            }
        }
    }

    /**
     * _addDataBaseToClass
     * @param {string} dbName
     * @private
     */
    private _addDataBaseToClass(dbName: string): void {
        let dbObj:object;

        for (let j in this.__schema[dbName].stores) {
            // @ts-ignore
            dbObj[j] = {
                ...this.__schema[dbName].stores[j],
                ...this._addDataBaseHandler(dbName, j)
            }
        }

        // @ts-ignore
        this[dbName] = dbObj;
    }

    /**
     * _addDataBaseHandler
     * @param {string} dbName
     * @param {string} storeName
     * @returns {object}
     * @private
     */
    private _addDataBaseHandler(dbName: string, storeName: string): dataBaseHandlerInterface {

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
            count: function (query = null) {
                return ths.count(dbName, storeName, query)
            },
            paginate: function (page = 1, perLength = 20) {
                return ths.paginate(dbName, storeName, page, perLength)
            },
            where: function (conditionIndex, conditionOperator, conditionValues) {
                return ths.where(dbName, storeName, conditionIndex, conditionOperator, conditionValues)
            },
            clear: function () {
                return ths.clearStore(dbName, storeName)
            },
            onInsert: function (event) {
                return ths.onInsert(dbName, storeName, event)
            },
            onUpdate: function (event) {
                return ths.onUpdate(dbName, storeName, event)
            },
            onDelete: function (event) {
                return ths.onDelete(dbName, storeName, event)
            },
            unbindInsert: function (key) {
                return ths.unbindInsert(dbName, storeName, key)
            },
            unbindUpdate: function (key) {
                return ths.unbindUpdate(dbName, storeName, key)
            },
            unbindDelete: function (key) {
                return ths.unbindDelete(dbName, storeName, key)
            },
            unbindAllInsert: function () {
                return ths.unbindAllInsert(dbName, storeName)
            },
            unbindAllUpdate: function () {
                return ths.unbindAllUpdate(dbName, storeName)
            },
            unbindAllDelete: function () {
                return ths.unbindAllDelete(dbName, storeName)
            },
        }
    }

    // Store Functions --------------------------
    // Public -----------------------------------

    /**
     * clearStore
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<indexDbOrm|*>}
     */
    public clearStore(dbName : string, storeName : string) : Promise<indexDbOrmInterface> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.clear();

                request.onsuccess = () => {
                    resolve(this)
                };

                request.onerror = (event: { target: any; }) => {
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
    private _createStoreObjectSchema(storeSchema : storeInterface) : storeInterface {
        if (!!storeSchema.name) {
            const keyPath = !!storeSchema.keyPath ? storeSchema.keyPath : configs.KEY_PATH;

            return {
                name: storeSchema.name,
                keyPath: keyPath,
                keyPathAuto: !!!storeSchema.keyPath,
                onInsert: [],
                onUpdate: [],
                onDelete: [],
                indexes: !!storeSchema.indexes && Array.isArray(storeSchema.indexes) ?
                    this._createIndexesArray(storeSchema.indexes, keyPath) :
                    this._createIndexesArray([], keyPath),
            }
        } else {
            return null;
        }
    }

    /**
     * _checkActiveDB
     * @param {string} dbName
     * @returns {boolean}
     * @private
     */
    private _checkActiveDB(dbName : string) : boolean {
        let dbObj = this.__schema[dbName];
        let db = dbObj.db;
        return !!db
    }

    /**
     * _transactionReadOnly
     * @param {string} dbName
     * @param {string} storeName
     * @returns {IDBTransaction}
     * @private
     */
    private _transactionReadOnly(dbName : string, storeName : string) : transactionInterface{
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
    private _transactionReadWrite(dbName : string, storeName : string) : transactionInterface {
        const dbObj = this.__schema[dbName];
        const db = dbObj.db;

        return db.transaction(storeName, configs.READ_WRITE);
    }

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
    private _createIndexesArray(indexesArr: indexInterface[], keyPath: string) : indexInterface[]{
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
    private _createIndexObject(name: string, keyPath: string|string[], option : {unique:boolean} = {unique: false} ): indexInterface {
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
    private _buildStoreIndexes(storeObject: storeObjectiveInterface, arrayIndexObj: indexInterface[]): void {
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
    private _buildStoreIndex(storeObject: storeObjectiveInterface, indexObj: indexInterface): void {
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
    public insert(dbName: string, storeName: string, data: {[key: string] : string|number}) : Promise<{[key: string] : string|number}> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                const newData = this._insertConvertDataEntry(dbName, storeName, data);
                this._runInsertEvent(dbName, storeName, newData);


                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);

                let request = transaction?.add(newData);
                let ths = this;

                request.onsuccess = function (event: { target: any; }) {
                    let req = event.target;
                    if (!!req.error) {
                        reject(req.error);
                    } else if (!!req.result) {
                        resolve(ths.find(dbName, storeName, req.result, configs.KEY_PATH))
                    } else {
                        reject(new Error(textMessage.ErrorSystem))
                    }
                };
                request.onerror = function (event: { target: any; }) {
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
    public update(dbName: string, storeName: string, data: {[key: string] : string|number}): Promise<{[key: string] : string|number}> {
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

                request.onsuccess = (event: { target: { result: any; }; }) => {

                    const currentData = event.target.result;
                    this._runUpdateEvent(dbName, storeName, newData, currentData);

                    let requestUpdate = transaction?.put(newData);

                    requestUpdate.onerror = (ev: { target: any; }) => {
                        let req = ev.target;
                        reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                    };
                    requestUpdate.onsuccess = async (ev: { target: any; }) => {
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

                request.onerror = (event: { target: any; }) => {
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
    public delete(dbName: string, storeName: string, _pk: string|number) : Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                await this._runDeleteEvent(dbName, storeName, _pk);

                let transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                let request = transaction?.delete(_pk);

                request.onsuccess = () => {
                    resolve(true);
                };

                request.onerror = function (event: { target: any; }) {
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
     * @param {string|number|array} value
     * @param {string} searchPk
     * @returns {Promise<object>}
     */
    public find(dbName: string, storeName: string, value: string|number, searchPk: string = null) : Promise<{[key: string] : string|number}> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let skp = !!searchPk ? searchPk : configs.KEY_PATH;

                const keyRangeValue = this.IDBKeyRange.only(value);
                let result: {[key: string] : string|number} = null;

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                let myIndex = transaction.index(skp);
                const getCursorRequest = myIndex.openCursor(keyRangeValue);

                getCursorRequest.onsuccess = function (event: { target: { result: any; }; }) {
                    const cursor = event.target.result;

                    if (cursor && !!!result) {
                        result = cursor.value;
                        cursor.continue();
                    } else {
                        resolve(result)
                    }
                };

                getCursorRequest.onerror = function (event: { error: any; }) {
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
    public all(dbName: string, storeName: string) : Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                let request = transaction?.getAll();

                request.onsuccess = (event: { target: { result: any; }; }) => {
                    const dt = event.target.result;
                    resolve(dt)
                };

                request.onerror = (event: { target: any; }) => {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * count
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} query
     * @returns {Promise<number>}
     */
    public count(dbName: string, storeName: string, query : any = null) : Promise<number>{
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                let request = transaction?.count(query);

                request.onsuccess = (event: { target: { result: any; }; }) => {
                    const dt = event.target.result;
                    resolve(dt)
                };

                request.onerror = (event: { target: any; }) => {
                    let req = event.target;
                    reject(!!req.error ? req.error : new Error(textMessage.ErrorSystem));
                };


            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * paginate
     * @param {string} dbName
     * @param {string} storeName
     * @param {?number} page
     * @param {?number} total
     * @returns {Promise<array>}
     */
    public paginate(dbName: string, storeName: string, page : number = 1, total : number = 20): Promise<object[]> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                const request = transaction.openCursor();
                let result: any[] = [];
                const start = (page - 1) * total;
                let hasSkipped = false;

                request.onsuccess = function (event: { target: { result: any; }; }) {
                    const cursor = event.target.result;

                    if (!hasSkipped && start > 0) {
                        hasSkipped = true;
                        cursor.advance(start);
                        return;
                    }
                    if (cursor) {
                        // @ts-ignore
                        result.push(cursor.value);
                        if (result.length < total) {
                            cursor.continue();
                        } else {
                            resolve(result);
                        }
                    } else {
                        resolve(result);
                    }
                };

                request.onerror = function () {
                    resolve([])
                };


            } catch (e) {
                resolve([])
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
     * @returns {Object}
     */
    public where(dbName: string, storeName: string, conditionIndex: string, conditionOperator: string, conditionValues: string|number|string[]|number[]):  whereObjectiveInterface{

        const addCondition = (cIndex: string, cOperator: string, cValues: string|number|string[]|number[]): void => {
            whereObject.conditions.push({
                index: cIndex,
                operator: cOperator,
                value: cValues
            })
        };

        const ths = this;

        const whereObject: whereObjectiveInterface = {
            dbName: dbName,
            storeName: storeName,
            conditions: [],
            orm: ths,
            where(cIndex: string, cOperator: string, cValues: string|number|string[]|number[]): whereObjectiveInterface {
                addCondition(cIndex, cOperator, cValues);
                return whereObject;
            },
            all(operation: string = 'and'): Promise<object[]> {
                return whereObject.orm._multiWhere(whereObject.dbName, whereObject.storeName, whereObject.conditions, operation);
            }
        };

        addCondition(conditionIndex, conditionOperator, conditionValues);

        return whereObject;

    }


    // Private ----------------------------------

    /**
     * _where
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} conditionIndex
     * @param {string} conditionOperator includes : = , > , >= , <= , < ,  between , betweenInclude , like , %like , like% , %like% , match
     * @param {number|string|array} conditionValues
     * @returns {Promise<array>}
     */
    private _where(dbName: string, storeName: string, conditionIndex: string, conditionOperator: string, conditionValues: string|number|string[]|number[]): Promise<object[]> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!this._checkActiveDB(dbName)) {
                    await this._openDB(dbName);
                }

                let keyRangeValue = null;
                let result: object[] = [];

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
                        if (Array.isArray(conditionValues) && conditionValues.length >= 2){
                            keyRangeValue = this.IDBKeyRange?.bound(conditionValues[0],conditionValues[1], true, true);
                        }else {
                            keyRangeValue = null;
                        }
                        break;
                    case "betweenInclude":
                        if (Array.isArray(conditionValues) && conditionValues.length >= 2){
                            keyRangeValue = this.IDBKeyRange?.bound(conditionValues[0],conditionValues[1], false, false);
                        }else {
                            keyRangeValue = null;
                        }
                        break;
                    default :
                        keyRangeValue = null;
                        break;
                }

                if (!!keyRangeValue) {

                    let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                    let myIndex = transaction.index(conditionIndex);
                    const getCursorRequest = myIndex.openCursor(keyRangeValue);

                    getCursorRequest.onsuccess = function (event: { target: { result: any; }; }) : void{
                        const cursor = event.target.result;
                        if (cursor) {
                            result.push(cursor.value);
                            cursor.continue();
                        } else {
                            resolve(result)
                        }
                    };

                    getCursorRequest.onerror = function (event: { error: any; }) : void {
                        console.error(event.error);
                        resolve([]);
                    };


                } else if (cursorConditionOperator.includes(conditionOperator)) {

                    const conditionStringValue = !!conditionValues && typeof conditionValues !== 'object' ? conditionValues.toString() : null;

                    if (!!conditionStringValue) {

                        let keyPaths = this._getStoreIndexKeyPaths(dbName, storeName, conditionIndex);


                        let transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        const getCursorRequest = transaction.openCursor();

                        getCursorRequest.onsuccess = function (event: { target: { result: any; }; }): void {
                            const cursor = event.target.result;

                            if (!!cursor && !!cursor.value) {

                                let searchValues = keyPaths.map(kp => {
                                    return {
                                        value: !!cursor.value[kp] ? cursor.value[kp] : "",
                                        result: false
                                    };
                                });


                                if (conditionOperator === 'like' ||
                                    conditionOperator === '%like%' ||
                                    conditionOperator === '%like' ||
                                    conditionOperator === 'like%' ||
                                    conditionOperator === 'match'
                                ) {
                                    let re: RegExp = null;
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
                                    }

                                    let resultShare = searchValues.map((it: { value: string; }) => {
                                        return {
                                            ...it,
                                            result: !!it.value && !!re && !!it.value.match(re)
                                        }
                                    }).reduce((res: any, it: { result: any; }) => {
                                        return res && it.result
                                    }, true);

                                    if (resultShare) {
                                        result.push(cursor.value);
                                    }

                                } else {

                                }

                                cursor.continue();
                            } else {
                                resolve(result)
                            }
                        };


                        getCursorRequest.onerror = function (event: { error: any; }): void {
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
     * _multiWhere
     * @param {string} dbName
     * @param {string} storeName
     * @param {array} conditions
     * @param {string} operator
     * @returns {Promise<array>}
     */
    private async _multiWhere(dbName: string, storeName: string, conditions:whereCondition[]  = [], operator: string = 'and'): Promise<object[]> {
        try {
            let conditionList = Array.isArray(conditions) ? conditions : [];
            let result: object[] = [];
            let cacheKeys: number[]|string[] = [];
            let cacheResult: object[];
            let storeObject = this.__schema[dbName].stores[storeName];
            let keyPath: string = storeObject?.keyPath;

            for (let i = 0; i < conditionList.length; i++) {
                if (!!conditionList[i].index && !!conditionList[i].operator && !!conditionList[i].value) {
                    try {
                        const res1 = await this._where(dbName, storeName, conditionList[i].index, conditionList[i].operator, conditionList[i].value);
                        // @ts-ignore
                        cacheResult = [...res1]
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
                            cacheKeys = cacheResult.map((it: { [x: string]: any; }) => it[keyPath]);
                            result = result.filter(it => {
                                // @ts-ignore
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
                return [

                ];
            } else {
                return result;
            }


        } catch (error) {
            console.log(error);
            return [];
        }
    }

    /**
     *
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} indexName
     * @returns {Array}
     * @private
     */
    private _getStoreIndexKeyPaths(dbName: string, storeName: string, indexName: string): string[] {
        const indexesArray = this.__schema[dbName]?.stores[storeName]?.indexes;

        if (!!indexesArray) {
            let indexObj = indexesArray.find(it => {
                return it.name === indexName
            });

            if (!!indexObj) {
                if (!!indexObj.keyPath) {
                    if (Array.isArray(indexObj.keyPath)) {
                        return indexObj.keyPath
                    } else {
                        return [indexObj.keyPath]
                    }
                } else {
                    return [];
                }
            } else {
                return [];
            }

        } else {
            return [];
        }
    }

    /**
     * _generatePkIndexValue
     * @returns {string}
     * @private
     */
    private _generatePkIndexValue() : string{
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
    private _insertConvertDataEntry(dbName : string, storeName : string , data : {[key: string] : string|number}) : {[key: string] : string|number} {

        const store = this.__schema[dbName].stores[storeName];
        const keyPath = store.keyPath;

        let newData = {...data};

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
    private _updateConvertDataEntry(dbName: string, storeName: string, data : {[key: string] : string|number}) : {[key: string] : string|number}  {
        const store = this.__schema[dbName].stores[storeName];
        const keyPath = store.keyPath;
        return data;
    }


    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------

    // Events -----------------------------------
    // Public -----------------------------------

    /**
     *
     * @param {string} dbName
     * @param {function} event
     * @returns {indexDbOrm}
     */
    public onRebuildDB(dbName: string, event: object): indexDbOrmInterface{
        this.__schema[dbName].onRebuild = event;
        return this;
    }

    /**
     * onInsert
     * @param {string} dbName
     * @param {string} storeName
     * @param {function} event
     */
    public onInsert(dbName: string, storeName: string, event: object): string|number{
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            let key = this._generatePkIndexValue();
            this.__schema[dbName].stores[storeName].onInsert.push({
                key: key,
                event: event
            });
            return key;
        }
    }

    /**
     * onUpdate
     * @param {string} dbName
     * @param {string} storeName
     * @param {function} event
     */
    public onUpdate(dbName: string, storeName: string, event: object): string|number {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            let key = this._generatePkIndexValue();
            this.__schema[dbName].stores[storeName].onUpdate.push({
                key: key,
                event: event
            });
            return key;
        }
    }

    /**
     * onDelete
     * @param {string} dbName
     * @param {string} storeName
     * @param {function} event
     */
    public onDelete(dbName: string, storeName: string, event: object): string|number {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            let key = this._generatePkIndexValue();
            this.__schema[dbName].stores[storeName].onDelete.push({
                key: key,
                event: event
            });
            return key;
        }
    }

    /**
     * unbindInsert
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} key
     * @returns {indexDbOrm}
     */
    public unbindInsert(dbName: string, storeName: string, key: string|number): indexDbOrmInterface{
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onInsert
        ) {
            this.__schema[dbName].stores[storeName].onInsert = [
                ...this.__schema[dbName].stores[storeName].onInsert.filter(it => it.key !== key)
            ]
        }
        return this;
    }

    /**
     * unbindUpdate
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} key
     * @returns {indexDbOrm}
     */
    public unbindUpdate(dbName: string, storeName: string, key: string|number): indexDbOrmInterface {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onUpdate
        ) {
            this.__schema[dbName].stores[storeName].onUpdate = [
                ...this.__schema[dbName].stores[storeName].onUpdate.filter(it => it.key !== key)
            ]
        }
        return this;
    }

    /**
     * unbindDelete
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} key
     * @returns {indexDbOrm}
     */
    public unbindDelete(dbName: string, storeName: string, key: string|number): indexDbOrmInterface {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onDelete
        ) {
            this.__schema[dbName].stores[storeName].onDelete = [
                ...this.__schema[dbName].stores[storeName].onDelete.filter(it => it.key !== key)
            ]
        }
        return this;
    }

    /**
     * unbindAllInsert
     * @param dbName
     * @param storeName
     * @returns {indexDbOrm}
     */
    public unbindAllInsert(dbName: string, storeName: string): indexDbOrmInterface{
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            this.__schema[dbName].stores[storeName].onInsert = [];
        }
        return this;
    }

    /**
     * unbindAllUpdate
     * @param dbName
     * @param storeName
     * @returns {indexDbOrm}
     */
    public unbindAllUpdate(dbName: string, storeName: string): indexDbOrmInterface{
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            this.__schema[dbName].stores[storeName].onUpdate = [];
        }
        return this;
    }

    /**
     * unbindAllDelete
     * @param dbName
     * @param storeName
     * @returns {indexDbOrm}
     */
    public unbindAllDelete(dbName: string, storeName: string): indexDbOrmInterface{
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            this.__schema[dbName].stores[storeName].onDelete = [];
        }
        return this;
    }

    // Private -------------------------------------

    /**
     * _runInsertEvent
     * @param {string} dbName
     * @param {string} storeName
     * @param {Object} data
     * @private
     */
    private _runInsertEvent(dbName:string, storeName:string, data:{[key: string] : string|number}) : void{
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onInsert
        ) {
            this.__schema[dbName].stores[storeName].onInsert.map(it => {
                it.event(data, it.key)
            })
        }
    }

    /**
     * _runUpdateEvent
     * @param {string} dbName
     * @param {string} storeName
     * @param {Object} newData
     * @param {Object} lastData
     * @private
     */
    private _runUpdateEvent(dbName: string, storeName: string, newData: {[key: string] : string|number}, lastData: {[key: string] : string|number}) : void {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onUpdate
        ) {
            this.__schema[dbName].stores[storeName].onUpdate.map(it => {
                it.event(newData, lastData, it.key)
            })
        }
    }

    /**
     * _runUpdateEvent
     * @param {string} dbName
     * @param {string} storeName
     * @param {string|number} pk
     * @private
     */
    private async _runDeleteEvent(dbName: string, storeName: string, pk: string|number) : Promise<void> {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onUpdate
        ) {
            try {
                let data = await this.find(dbName, storeName, pk);
                this.__schema[dbName].stores[storeName].onDelete.map(it => {
                    it.event(data, it.key)
                })
            } catch (e) {
            }
        }
    }

    // ORM Operation Functions ------------------
    // Public -----------------------------------

    /**
     * build
     * @returns {Promise<indexDbOrm>}
     */
    public build(): Promise<indexDbOrmInterface> {

        this._addOrmDB();

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

                        this._addDataBaseToClass(i);

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
    private _addOrmDB(): void{
        // this.addDB({
        //     name: ormDBName,
        //     stores: [
        //         {
        //             name: ormStorePagination,
        //             indexes: [
        //                 {name: 'code', keyPath: 'code', option: {unique: true}},
        //                 {name: 'group', keyPath: 'group', option: {unique: false}},
        //                 {name: 'page', keyPath: 'page', option: {unique: false}},
        //                 {name: 'per', keyPath: 'per', option: {unique: false}},
        //                 {name: 'max', keyPath: 'max', option: {unique: false}},
        //             ]
        //         }
        //     ]
        // })
    }

    /**
     * _setCurrentVersionOnSchema
     * @param dbName
     * @returns {Promise<number>}
     * @private
     */
    private _setCurrentVersionOnSchema(dbName: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                this.__schema[dbName].currentVersion = await this.getDataBaseVersion(dbName);
                resolve(this.__schema[dbName].currentVersion);
            } catch (e) {
                resolve(1);
            }
        })
    }

    /**
     * _compareStoresToVersionChange
     * @param {string} dbName
     * @returns {Promise<boolean>}
     * @private
     */
    private _compareStoresToVersionChange(dbName: string): Promise<boolean> {
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
    private _rebuildDB(dbName: string): Promise<boolean> {
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


}


export default indexDbOrm;
