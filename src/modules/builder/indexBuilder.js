import IndexBuilderExtend from "../extend/indexBuilderExtend";


class IndexBuilder extends IndexBuilderExtend {

    storeName = "store";
    index = null;
    name = "";
    keyPath = "";
    option = {};


    /**
     * build constructor
     * @param {Object <storeName,name,keyPath,option>} params
     */
    constructor(params={}) {
        super();

        if ("storeName" in params){
            this.setStoreName(params.storeName);
        }

        if ("name" in params){
            this.setName(params.name);
        }

        if ("keyPath" in params){
            this.setKeyPath(params.keyPath);
        }

        if ("option" in params){
            this.setOption(params.option);
        }
    }

    /**
     * set store name
     * @param {string} storeName
     * @returns {IndexBuilder}
     */
    setStoreName(storeName){
        this.storeName = storeName;
        return this;
    }

    /**
     * set name
     * @param {string} name
     * @returns {IndexBuilder}
     */
    setName(name){
        this.name = name;
        return this;
    }

    /**
     * set keyPath
     * @param {string} keyPath
     * @returns {IndexBuilder}
     */
    setKeyPath(keyPath){
        this.keyPath = keyPath;
        return this;
    }

    /**
     * set option
     * @param {Object <unique,multiEntry>} option
     * @returns {IndexBuilder}
     */
    setOption(option={}){
        this.option = option;
        return this;
    }

    /**
     * build store object
     * @param {Object} storeObj
     * @returns {IndexBuilder}
     */
    build(storeObj){

        this.index = storeObj.createIndex(this.name, this.keyPath, this.option);

        return this;
    }


}



export default IndexBuilder;
