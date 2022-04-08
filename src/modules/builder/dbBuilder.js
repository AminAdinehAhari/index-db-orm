import DbBuilderExtend from "../extend/dbBuilderExtend";


class DbBuilder extends DbBuilderExtend {


    name = 'db';
    version = 1;
    request = null;
    db = null;
    dbStatus = 0; // 0 unknown 1 loaded 2 complete 3 error
    store = {};
    onReady=null;

    callBackSuccess = null;
    callBackError = null;
    callBackUpgradeNeeds = null;
    callBackBlocked = null;

    /**
     * build constructor
     * @param {Object} option - {name:?string,version:?number}
     */
    constructor(option = {}) {
        super();

        if ('name' in option)
            this.setName(option['name']);

        if ('version' in option)
            this.setVersion(option['version']);

        if ('onSuccess' in option)
            this.onSuccess(option['onSuccess']);

        if ('onError' in option)
            this.onError(option['onError']);

        if ('onUpgradeNeeds' in option)
            this.onUpgradeNeeds(option['onUpgradeNeeds']);

        if ('onBlocked' in option)
            this.onBlocked(option['onBlocked']);

    }

    /**
     * set db name
     * @param name
     * @returns {DbBuilder}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * set db version
     * @param {number} version
     * @returns {DbBuilder}
     */
    setVersion(version) {
        if (Number.isInteger(version)) {
            this.version = version;
        }
        return this;
    }

    /**
     * open db
     * @param {Object} indexDb
     * @param {?function} onReady
     * @returns {DbBuilder}
     */
    openDb(indexDb,onReady=null) {
        this.dbStatus = 1;
        this.onReady = onReady;
        this.request = indexDb.open(this.name, this.version);
        this.handleEvents();
        return this;
    }


    /**
     * set db value
     * @param {Object} db
     */
    setDb(db) {
        this.dbStatus = 2;
        if (!!!this.db) {
            this.db = db;
            this.buildStores();
        } else {
            this.db = db;
        }
    }

    //----------------------------------
    // event methods -------------------
    //----------------------------------

    /**
     * active handle observer event
     */
    handleEvents() {
        this.request.onerror = event => {
            // console.log("onerror");
            if (!!this.callBackError) {
                this.callBackError(event);
            }
            this.dbStatus = 3;
        };

        this.request.onsuccess = event => {
            // console.log("onsuccess",event.target.result);
            if (!!this.callBackSuccess) {
                this.callBackSuccess(event);
            }
            this.setDb(event.target.result);
        };

        this.request.onupgradeneeded = event => {
            // console.log("onupgradeneeded",event.target.result);
            if (!!this.callBackUpgradeNeeds) {
                this.callBackUpgradeNeeds(event);
            }
            this.setDb(event.target.result, true);
        };

        this.request.onblocked = event => {
            // console.log("onblocked");
            if (!!this.callBackBlocked) {
                this.callBackBlocked(event);
            }
        }
    }

    /**
     * set success callback function
     * @param {function} callback
     * @returns {DbBuilder}
     */
    onSuccess(callback) {
        if (!!callback && typeof callback === 'function') {
            this.callBackSuccess = callback;
        }
        return this;
    }

    /**
     * set error callback function
     * @param {function} callback
     * @returns {DbBuilder}
     */
    onError(callback) {
        if (!!callback && typeof callback === 'function') {
            this.callBackError = callback;
        }
        return this;
    }

    /**
     * set upgrade need callback function
     * @param {function} callback
     * @returns {DbBuilder}
     */
    onUpgradeNeeds(callback) {
        if (!!callback && typeof callback === 'function') {
            this.callBackUpgradeNeeds = callback;
        }
        return this;
    }

    /**
     * set block callback function
     * @param {function} callback
     * @returns {DbBuilder}
     */
    onBlocked(callback) {
        if (!!callback && typeof callback === 'function') {
            this.callBackBlocked = callback;
        }
        return this;
    }

    //----------------------------------------
    // store ---------------------------------
    //----------------------------------------

    /**
     * add store to database
     * @param {Object} storeObj - instance of StoreBuilder
     * @returns {DbBuilder}
     */
    addStore(storeObj) {
        if (storeObj?.getClassName() === 'StoreBuilder') {
            this.store[storeObj.name] = storeObj.setDbName(this.name);
        }
        return this;
    }


    //---------------------------------------
    // build --------------------------------
    //---------------------------------------

    /**
     * 1- build all store
     * 2- when complete build stores then onReady event
     */
    buildStores() {
        const ths = this;
        let storeLength = Object.keys(this.store).length;
        let checked = [];

        for (let i in this.store) {
            this.store[i].onTransactionComplete(function (event,thisObj) {
                checked.push(thisObj.name);

                thisObj.setDb(ths.db);

                if (checked.length === storeLength){
                    if (!!ths.onReady && typeof ths.onReady === 'function'){
                        ths.onReady(ths.name);
                    }
                }

            }).build(this.db)
        }

        if (storeLength === 0 && !!ths.onReady && typeof ths.onReady === 'function'){
            this.onReady(this.name);
        }


    }


}


export default DbBuilder;
