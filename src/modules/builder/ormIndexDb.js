import textMessage from "../textMessage";
import OrmIndexExtend from "../extend/ormIndexExtend";


class OrmIndexDb extends OrmIndexExtend {

    IDB = null;
    IDBTransaction = null;
    IDBKeyRange = null;
    db = {};

    /**
     * constructor :
     * 1- check browser support
     */
    constructor() {
        super();
        try {
            this.checkBrowserSupport();
        } catch (e) {

        }
    }

    /**
     * check browser support in indexDb
     */
    checkBrowserSupport() {
        this.IDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
        this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        if (!this.IDB) {
            console.error(textMessage.ErrorBrowserSupport);
            throw textMessage.ErrorBrowserSupport;
        }
    }

    /**
     * get all ( add or installer db ) DB list of IDB
     * @returns {Promise<*[]|*>}
     */
    async getAllDatabases() {
        try {
            return await this.IDB.databases();
        } catch (e) {
            return [];
        }
    }

    /**
     * remove all database
     * @returns {OrmIndexDb}
     */
    async removeAllDataBase() {
        let DB = await this.getAllDatabases();
        for (let i = 0; i < DB.length; i++) {
            await this.removeDataBase(DB[i].name)
        }
        return this;
    }

    /**
     * remove database
     * @param dataBaseName
     * @returns {OrmIndexDb}
     */
    async removeDataBase(dataBaseName) {
        await this.IDB.deleteDatabase(dataBaseName);
        return this;
    }

    /**
     * add db to db
     * @param {Object} dbObj - instance of DbClass
     */
    addDb(dbObj) {

        if (dbObj.getClassName() !== "DbBuilder") {
            console.error(textMessage.ErrorDbBuilderClass)
        }

        if (!!!dbObj.name) {
            console.error(textMessage.ErrorDbBuilderNotName)
        }

        if (dbObj.getClassName() === "DbBuilder" && !!dbObj.name) {
            this.db[dbObj.name] = dbObj;
        }

        return this;
    }

    /**
     * build orm
     * @param {function} onReady
     * @returns {OrmIndexDb}
     */
    build(onReady=null){
        let checked = [];
        let dbLength = Object.keys(this.db).length;

        for (let i in this.db){
            this.db[i].openDb(this.IDB,function (name) {
                checked.push(name);
                if (checked.length === dbLength &&
                    !!onReady && typeof onReady === 'function' ){
                    onReady();
                }
            });
        }


        if (dbLength === 0 && !!onReady && typeof onReady === 'function'){
            onReady();
        }


        return this;
    }

}


export default OrmIndexDb;
