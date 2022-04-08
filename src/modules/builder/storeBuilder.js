import StoreBuilderExtend from "../extend/storeBuilderExtend";
import TransactionResponse from "../transactionResponse";
import IndexBuilder from "./indexBuilder";
import textMessage from "../textMessage";
import configs from "../configs";

class StoreBuilder extends StoreBuilderExtend {

    name = 'store';
    store = null;
    dbName = 'db';
    db = null;
    keyPath = null;
    indexes = {};

    callBackTransactionComplete = null;
    callBackTransactionError = null;

    /**
     * build constructor
     * @param {Object <{name:string,keyPath:string,indexesSchemas:array<{name:'',keyPath:'',option:{unique:?boolean,relation:?array}}>}>} options
     */
    constructor(options = {}) {
        super();

        if ('name' in options) {
            this.setName(options.name);
        }

        if ('keyPath' in options) {
            this.setKeyPath(options.keyPath)
        }

        if ('indexesSchemas' in options) {
            this.setIndexesSchemas(options.indexesSchemas);
        }

    }

    /**
     * set store name
     * @param {string} name
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * set database name
     * @param {string} dbName
     */
    setDbName(dbName) {
        this.dbName = dbName;
        return this;
    }

    /**
     * set database
     * @param {Object} db
     */
    setDb(db) {
        this.db = db;
        return this;
    }

    /**
     * set store keyPath field
     * @param {string} keyPath
     */
    setKeyPath(keyPath) {
        this.keyPath = keyPath;
        return this;
    }

    //------------------------------------
    // indexes ---------------------------
    //------------------------------------

    /**
     * set all indexes schemas list
     * @param {array<Object>} schemas
     */
    setIndexesSchemas(schemas) {
        this.indexes = {};
        for (let i = 0; i < schemas.length; i++) {
            this.addIndexSchema(schemas[i])
        }
    }

    /**
     * add index object to indexes map
     * @param {Object} indexDbObj
     */
    addIndexSchema(indexDbObj) {
        if (indexDbObj.getClassName() === 'IndexBuilder') {
            indexDbObj.setStoreName(this.name);
            this.indexes[indexDbObj.name] = indexDbObj;
        }
    }

    //--------------------------------------
    // event handler -----------------------
    //--------------------------------------

    /**
     * set event handler
     */
    eventHandler() {
        this.store.transaction.oncomplete = event => {
            if (!!this.callBackTransactionComplete) {
                this.callBackTransactionComplete(event, this);
            }
        };

        this.store.transaction.onerror = event => {
            if (!!this.callBackTransactionError) {
                this.callBackTransactionError(event, this);
            }
        };
    }

    /**
     * set on transaction complete
     * @param {function} callback
     * @returns {StoreBuilder}
     */
    onTransactionComplete(callback) {
        if (!!callback && typeof callback === 'function') {
            this.callBackTransactionComplete = callback;
        }

        return this
    }

    /**
     * set on transaction error
     * @param {function} callback
     * @returns {StoreBuilder}
     */
    onTransactionError(callback) {
        if (!!callback && typeof callback === 'function') {
            this.callBackTransactionError = callback;
        }
        return this;
    }

    //------------------------------------
    // pk index  -------------------------
    //------------------------------------

    /**
     * create pk index
     * @returns {string}
     */
    createPkIndexValue() {
        let rand = Math.ceil(9 * Math.random());
        return Date.now() + '0' + rand;
    }


    /**
     * create default pk value
     * @returns {StoreBuilder}
     */
    setPkObjectIndex() {
        this.addIndexSchema(
            new IndexBuilder({name: configs.KEY_PATH, keyPath: configs.KEY_PATH, option: {unique: true}}),
        );
        return this;
    }


    convertDataEntry(data) {
        if (!!this.keyPath) {
            return data;
        } else {
            let dt = data;
            dt[configs.KEY_PATH] = this.createPkIndexValue();
            return dt;
        }

    }


    //------------------------------------
    // build  ----------------------------
    //------------------------------------

    /**
     * create object store and build indexes object
     * @param {Object} db
     * @returns {StoreBuilder}
     */
    async build(db) {
        let option = {};
        if (!!this.keyPath) {
            option = {"keyPath": this.keyPath ,  "autoIncrement": true};
        } else {
            option = {"keyPath": option.keyPath , "autoIncrement": true};
            this.setPkObjectIndex();
        }

        this.store = db.createObjectStore(this.name, option);

        this.buildIndexes();

        this.eventHandler();


        return this;
    }

    /**
     * build all indexes object
     * @returns {StoreBuilder}
     */
    async buildIndexes() {
        for (let i in this.indexes) {
            await this.indexes[i].build(this.store);
        }
        return this;
    }

    /**
     * create read only transaction
     * @returns {IDBObjectStore}
     */
    transactionReadOnly() {
        return this.db?.transaction(this.name, configs.READ_ONLY).objectStore(this.name);
    }

    /**
     * create read and write transaction
     * @returns {IDBObjectStore}
     */
    transactionReadWrite() {
        return this.db?.transaction(this.name, configs.READ_WRITE).objectStore(this.name);
    }


    /**
     * insert data in store
     * @param {Object} data
     */
    insert(data) {
        return new Promise((resolve, reject) => {
            try {
                let transaction = this.transactionReadWrite();
                let dt = this.convertDataEntry(data);
                console.log(dt);
                let request = transaction?.add(dt);

                const checkResponse = (req) => {

                    if (!!req.error) {
                        reject((new TransactionResponse()).getErrorResponse(req.error, req.transaction));
                    } else {
                        resolve((new TransactionResponse())
                            .setStatus(true, 'success')
                            .setMessage(textMessage.SuccessInsertDoing)
                            .setResult(req.result)
                            .setTransaction(transaction)
                            .setRequest(request)
                            .setData(dt)
                            .getResponse());
                    }
                };

                request.onsuccess = function (event) {checkResponse(request)};
                request.onerror = function (event) {checkResponse(request)};

            } catch (e) {
                reject((new TransactionResponse()).getSysErrorResponse(e));
            }
        })
    }


    /**
     * get value by keyPath
     * @param {string|number} _pk
     * @returns {Promise<Object>}
     */
    get(_pk) {
        // return new Promise((resolve, reject) => {
        //     try {
        //         let transaction = this.transactionReadWrite();
        //         let request = transaction?.get(_pk);
        //
        //         const checkResponse = (req) => {
        //
        //             if (!!req.error) {
        //                 reject((new TransactionResponse()).getErrorResponse(req.error, req.transaction));
        //             } else {
        //
        //                 resolve((new TransactionResponse())
        //                     .setStatus(true, 'success')
        //                     .setMessage(textMessage.SuccessSelectDoing)
        //                     .setResult(req.result)
        //                     .setRequest(request)
        //                     .setTransaction(transaction)
        //                     .createSetObjData(_pk, req.result)
        //                     .getResponse());
        //             }
        //
        //         };
        //
        //         request.onsuccess = function (event) {
        //             checkResponse(request);
        //         };
        //         request.onerror = function (event) {
        //             checkResponse(request);
        //         };
        //
        //     } catch (e) {
        //         reject((new TransactionResponse()).getSysErrorResponse(e));
        //     }
        // })
    }


    /**
     * update data in store
     * @param {Object} data
     */
    update(data){

    }


}


export default StoreBuilder
