"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var textMessage_1 = require("./helper/textMessage");
var configs_1 = require("./helper/configs");
// const ormDBName: string = "___orm";
// const ormStorePagination: string = "paginate";
var indexDbOrm = /** @class */ (function () {
    /**
     * constructor : check Browser Support
     */
    function indexDbOrm(mode) {
        if (mode === void 0) { mode = 'product'; }
        this.IDB = null;
        this.IDBTransaction = null;
        this.IDBKeyRange = null;
        this.__schema = {};
        this.__mode = 'product';
        this.__mode = mode;
        this.checkBrowserSupport();
    }
    // Support Functions ------------------------
    //-------------------------------------------
    /**
     * checkBrowserSupport
     */
    indexDbOrm.prototype.checkBrowserSupport = function () {
        if (this.__mode === 'test') {
            if (process.env.NODE_ENV !== 'production') {
                var fakerIDB = require("fake-indexeddb");
                var fakerIDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
                var fakerIDBTransaction = require("fake-indexeddb/lib/FDBTransaction");
                this.IDB = fakerIDB;
                this.IDBTransaction = fakerIDBTransaction;
                this.IDBKeyRange = fakerIDBKeyRange;
            }
        }
        else {
            try {
                this.IDB = window.indexedDB;
                this.IDBTransaction = window.IDBTransaction || { READ_WRITE: "readwrite" };
                // @ts-ignore
                this.IDBKeyRange = window.IDBKeyRange;
            }
            catch (e) {
                this.IDB = null;
                this.IDBTransaction = null;
                this.IDBKeyRange = null;
            }
        }
        if (!!!this.IDB) {
            throw textMessage_1["default"].ErrorBrowserSupport;
        }
    };
    //-------------------------------------------
    //-------------------------------------------
    //-------------------------------------------
    // DB Functional ----------------------------
    // Public -----------------------------------
    /**
     * getAllDatabases
     * @returns {Promise<array>}
     */
    indexDbOrm.prototype.getAllDatabases = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.IDB.databases()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * getDataBase
     * @param {String} name
     * @returns {Promise<Object>}
     */
    indexDbOrm.prototype.getDataBase = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var all, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAllDatabases()];
                    case 1:
                        all = _a.sent();
                        return [2 /*return*/, all.find(function (it) { return it.name === name; })];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_2];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     * getDataBaseVersion
     * @param {string} name
     * @returns {Promise<number|*>}
     */
    indexDbOrm.prototype.getDataBaseVersion = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var dataBase, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getDataBase(name)];
                    case 1:
                        dataBase = _a.sent();
                        if (!!dataBase) {
                            return [2 /*return*/, dataBase.version];
                        }
                        else {
                            return [2 /*return*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        return [2 /*return*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * removeAllDataBase
     * @returns {Promise<indexDbOrm>}
     */
    indexDbOrm.prototype.removeAllDataBase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var DB, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllDatabases()];
                    case 1:
                        DB = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < DB.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.removeDataBase(DB[i].name)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * removeDataBase
     * @param {string} name
     * @returns {Promise<indexDbOrm|error>}
     */
    indexDbOrm.prototype.removeDataBase = function (name) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var e_4, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._closeDB(name)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _b.sent();
                        return [3 /*break*/, 3];
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, ((_a = this.IDB) === null || _a === void 0 ? void 0 : _a.deleteDatabase(name))];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this._timeout(100)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        try {
                            this._removeDataBaseOfSchema(name);
                            this._removeDataBaseOfClass(name);
                            return [2 /*return*/, this];
                        }
                        catch (e) {
                            return [2 /*return*/, e];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Private -----------------------------------
    /**
     * _timeout
     * @param {number} ms
     * @returns {Promise<unknown>}
     * @private
     */
    indexDbOrm.prototype._timeout = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    /**
     * _removeDataBaseOfSchema
     * @param {string} dataBaseName
     * @returns {Error|indexDbOrm}
     * @private
     */
    indexDbOrm.prototype._removeDataBaseOfSchema = function (dataBaseName) {
        try {
            delete this.__schema[dataBaseName];
            return this;
        }
        catch (error) {
            return error;
        }
    };
    /**
     * _removeDataBaseOfClass
     * @param {string} dataBaseName
     * @returns {Error|indexDbOrm}
     * @private
     */
    indexDbOrm.prototype._removeDataBaseOfClass = function (dataBaseName) {
        try {
            // @ts-ignore
            delete this[dataBaseName];
            return this;
        }
        catch (error) {
            return error;
        }
    };
    /**
     * _createDbStores
     * @param {string} dbName
     * @returns {Promise<*|indexDbOrm>}
     * @private
     */
    indexDbOrm.prototype._createDbStores = function (dbName) {
        return __awaiter(this, void 0, void 0, function () {
            var stores, start, _a, _b, _i, i, e_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        stores = this.__schema[dbName].stores;
                        start = true;
                        _a = [];
                        for (_b in stores)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        i = _a[_i];
                        if (!start) {
                            this.__schema[dbName].version = this.__schema[dbName].version + 1;
                        }
                        start = false;
                        if (!!!!this.__schema[dbName].db) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [4 /*yield*/, this._createDbStore(dbName, i)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, this._timeout(100)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this._closeDB(dbName)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        this.__schema[dbName].isBuild = true;
                        return [2 /*return*/, this];
                    case 9:
                        e_5 = _c.sent();
                        console.error(e_5);
                        return [2 /*return*/, e_5];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _createDbStore
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<boolean|error>}
     * @private
     */
    indexDbOrm.prototype._createDbStore = function (dbName, storeName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var store = _this.__schema[dbName].stores[storeName];
                var db = _this.__schema[dbName].db;
                if (!!db) {
                    var objectStore = db.createObjectStore(store.name, { autoIncrement: true, keyPath: store.keyPath });
                    _this._buildStoreIndexes(objectStore, store.indexes);
                    objectStore.transaction.oncomplete = function () {
                        resolve(true);
                    };
                    objectStore.transaction.onerror = function (event) {
                        reject(event.error);
                    };
                }
                else {
                    reject(new Error(textMessage_1["default"].ErrorDataBaseNotOpened));
                }
            }
            catch (e) {
                reject(e);
            }
        });
    };
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
    indexDbOrm.prototype.addDB = function (dbSchema) {
        var stores = {};
        for (var i = 0; i < dbSchema.stores.length; i++) {
            var res = this._createStoreObjectSchema(dbSchema.stores[i]);
            if (!!res) {
                // @ts-ignore
                stores[res === null || res === void 0 ? void 0 : res.name] = res;
            }
        }
        this.__schema[dbSchema.name] = {
            version: 1,
            currentVersion: 1,
            db: null,
            name: dbSchema.name,
            onRebuild: dbSchema === null || dbSchema === void 0 ? void 0 : dbSchema.onRebuild,
            isBuild: false,
            stores: stores
        };
        return this;
    };
    /**
     *
     */
    indexDbOrm.prototype.allDbClose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.__schema)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        return [4 /*yield*/, this._closeDB(i)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    // Private ----------------------------------
    /**
     * _openDB
     * @param {string} name
     * @returns {Promise<object>}
     * @private
     */
    indexDbOrm.prototype._openDB = function (name) {
        var _this = this;
        var version = Math.max(this.__schema[name].version, this.__schema[name].currentVersion);
        return new Promise(function (resolve, reject) {
            try {
                var request = _this.IDB.open(name, version);
                request.onerror = function (event) {
                    var _a;
                    // @ts-ignore
                    reject(version, (_a = event.target) === null || _a === void 0 ? void 0 : _a.error);
                };
                request.onsuccess = function (event) {
                    var db = event.target.result;
                    _this.__schema[name].db = event.target.result;
                    _this.__schema[name].version = parseInt(db.version);
                    resolve({ type: 'success', db: db });
                };
                request.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    _this.__schema[name].db = event.target.result;
                    _this.__schema[name].version = parseInt(db.version);
                    resolve({ type: 'upgrade', db: db });
                };
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * _closeDB
     * @param {string} name
     * @returns {Promise<*>}
     * @private
     */
    indexDbOrm.prototype._closeDB = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                (_a = _this.__schema[name].db) === null || _a === void 0 ? void 0 : _a.close();
                _this.__schema[name].db = null;
                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * _rebuildDBEvent
     * @param {string} name
     * @private
     */
    indexDbOrm.prototype._rebuildDBEvent = function (name) {
        if (this.__schema[name].isBuild) {
            var ev = this.__schema[name].onRebuild;
            if (!!ev) {
                ev();
                this.__schema[name].isBuild = false;
            }
        }
    };
    /**
     * _addDataBaseToClass
     * @param {string} dbName
     * @private
     */
    indexDbOrm.prototype._addDataBaseToClass = function (dbName) {
        var dbObj;
        for (var j in this.__schema[dbName].stores) {
            // @ts-ignore
            dbObj[j] = __assign(__assign({}, this.__schema[dbName].stores[j]), this._addDataBaseHandler(dbName, j));
        }
        // @ts-ignore
        this[dbName] = dbObj;
    };
    /**
     * _addDataBaseHandler
     * @param {string} dbName
     * @param {string} storeName
     * @returns {object}
     * @private
     */
    indexDbOrm.prototype._addDataBaseHandler = function (dbName, storeName) {
        var ths = this;
        return {
            insert: function (data) {
                return ths.insert(dbName, storeName, data);
            },
            update: function (data) {
                return ths.update(dbName, storeName, data);
            },
            "delete": function (_pk) {
                return ths["delete"](dbName, storeName, _pk);
            },
            find: function (value, searchPk) {
                if (searchPk === void 0) { searchPk = null; }
                return ths.find(dbName, storeName, value, searchPk);
            },
            all: function () {
                return ths.all(dbName, storeName);
            },
            count: function (query) {
                if (query === void 0) { query = null; }
                return ths.count(dbName, storeName, query);
            },
            paginate: function (page, perLength) {
                if (page === void 0) { page = 1; }
                if (perLength === void 0) { perLength = 20; }
                return ths.paginate(dbName, storeName, page, perLength);
            },
            where: function (conditionIndex, conditionOperator, conditionValues) {
                return ths.where(dbName, storeName, conditionIndex, conditionOperator, conditionValues);
            },
            clear: function () {
                return ths.clearStore(dbName, storeName);
            },
            onInsert: function (event) {
                return ths.onInsert(dbName, storeName, event);
            },
            onUpdate: function (event) {
                return ths.onUpdate(dbName, storeName, event);
            },
            onDelete: function (event) {
                return ths.onDelete(dbName, storeName, event);
            },
            unbindInsert: function (key) {
                return ths.unbindInsert(dbName, storeName, key);
            },
            unbindUpdate: function (key) {
                return ths.unbindUpdate(dbName, storeName, key);
            },
            unbindDelete: function (key) {
                return ths.unbindDelete(dbName, storeName, key);
            },
            unbindAllInsert: function () {
                return ths.unbindAllInsert(dbName, storeName);
            },
            unbindAllUpdate: function () {
                return ths.unbindAllUpdate(dbName, storeName);
            },
            unbindAllDelete: function () {
                return ths.unbindAllDelete(dbName, storeName);
            }
        };
    };
    // Store Functions --------------------------
    // Public -----------------------------------
    /**
     * clearStore
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<indexDbOrm|*>}
     */
    indexDbOrm.prototype.clearStore = function (dbName, storeName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var transaction, request, e_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                        request = transaction === null || transaction === void 0 ? void 0 : transaction.clear();
                        request.onsuccess = function () {
                            resolve(_this);
                        };
                        request.onerror = function (event) {
                            var req = event.target;
                            reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        reject(e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    // Private ----------------------------------
    /**
     * _createStoreObjectSchema
     * @param {string} storeSchema
     * @returns {null|{indexes: (*), keyPath: string, name: *, keyPathAuto: boolean}}
     * @private
     */
    indexDbOrm.prototype._createStoreObjectSchema = function (storeSchema) {
        if (!!storeSchema.name) {
            var keyPath = !!storeSchema.keyPath ? storeSchema.keyPath : configs_1["default"].KEY_PATH;
            return {
                name: storeSchema.name,
                keyPath: keyPath,
                keyPathAuto: !!!storeSchema.keyPath,
                onInsert: [],
                onUpdate: [],
                onDelete: [],
                indexes: !!storeSchema.indexes && Array.isArray(storeSchema.indexes) ?
                    this._createIndexesArray(storeSchema.indexes, keyPath) :
                    this._createIndexesArray([], keyPath)
            };
        }
        else {
            return null;
        }
    };
    /**
     * _checkActiveDB
     * @param {string} dbName
     * @returns {boolean}
     * @private
     */
    indexDbOrm.prototype._checkActiveDB = function (dbName) {
        var dbObj = this.__schema[dbName];
        var db = dbObj.db;
        return !!db;
    };
    /**
     * _transactionReadOnly
     * @param {string} dbName
     * @param {string} storeName
     * @returns {IDBTransaction}
     * @private
     */
    indexDbOrm.prototype._transactionReadOnly = function (dbName, storeName) {
        var dbObj = this.__schema[dbName];
        var db = dbObj.db;
        return db === null || db === void 0 ? void 0 : db.transaction(storeName, configs_1["default"].READ_ONLY);
    };
    /**
     * _transactionReadWrite
     * @param {string} dbName
     * @param {string} storeName
     * @returns {IDBTransaction}
     * @private
     */
    indexDbOrm.prototype._transactionReadWrite = function (dbName, storeName) {
        var dbObj = this.__schema[dbName];
        var db = dbObj.db;
        return db.transaction(storeName, configs_1["default"].READ_WRITE);
    };
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
    indexDbOrm.prototype._createIndexesArray = function (indexesArr, keyPath) {
        var _this = this;
        var indexes = indexesArr.map(function (it) {
            return _this._createIndexObject(it.name, it.keyPath, it.option);
        });
        return __spreadArray([
            this._createIndexObject(configs_1["default"].KEY_PATH, keyPath, { unique: true })
        ], indexes, true).filter(function (it) { return !!it; });
    };
    /**
     *_createIndexObject
     * @param {string} name
     * @param {string} keyPath
     * @param {Object} option
     * @returns {{keyPath: *, name: *, option: ({unique: boolean})}|null}
     * @private
     */
    indexDbOrm.prototype._createIndexObject = function (name, keyPath, option) {
        if (option === void 0) { option = { unique: false }; }
        if (!!name && !!keyPath) {
            return {
                name: name,
                keyPath: keyPath,
                option: !!option ? option : { unique: false }
            };
        }
        else {
            return null;
        }
    };
    /**
     * _buildStoreIndexes
     * @param {string} storeObject
     * @param {array} arrayIndexObj
     * @private
     */
    indexDbOrm.prototype._buildStoreIndexes = function (storeObject, arrayIndexObj) {
        for (var i = 0; i < arrayIndexObj.length; i++) {
            this._buildStoreIndex(storeObject, arrayIndexObj[i]);
        }
    };
    /**
     * _buildStoreIndex
     * @param {Object} storeObject
     * @param {Object} indexObj
     * @private
     */
    indexDbOrm.prototype._buildStoreIndex = function (storeObject, indexObj) {
        storeObject.createIndex(indexObj.name, indexObj.keyPath, indexObj.option);
    };
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
    indexDbOrm.prototype.insert = function (dbName, storeName, data) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var newData, transaction, request, ths_1, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        newData = this._insertConvertDataEntry(dbName, storeName, data);
                        this._runInsertEvent(dbName, storeName, newData);
                        transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                        request = transaction === null || transaction === void 0 ? void 0 : transaction.add(newData);
                        ths_1 = this;
                        request.onsuccess = function (event) {
                            var req = event.target;
                            if (!!req.error) {
                                reject(req.error);
                            }
                            else if (!!req.result) {
                                resolve(ths_1.find(dbName, storeName, req.result, configs_1["default"].KEY_PATH));
                            }
                            else {
                                reject(new Error(textMessage_1["default"].ErrorSystem));
                            }
                        };
                        request.onerror = function (event) {
                            var req = event.target;
                            reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_7 = _a.sent();
                        reject(e_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * update
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} data
     * @returns {Promise<Error|Object>}
     */
    indexDbOrm.prototype.update = function (dbName, storeName, data) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _pk, newData_1, transaction_1, request, ths_2, e_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _pk = data[configs_1["default"].KEY_PATH];
                        newData_1 = this._updateConvertDataEntry(dbName, storeName, data);
                        transaction_1 = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                        request = transaction_1 === null || transaction_1 === void 0 ? void 0 : transaction_1.get(_pk);
                        ths_2 = this;
                        request.onsuccess = function (event) {
                            var currentData = event.target.result;
                            _this._runUpdateEvent(dbName, storeName, newData_1, currentData);
                            var requestUpdate = transaction_1 === null || transaction_1 === void 0 ? void 0 : transaction_1.put(newData_1);
                            requestUpdate.onerror = function (ev) {
                                var req = ev.target;
                                reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                            };
                            requestUpdate.onsuccess = function (ev) { return __awaiter(_this, void 0, void 0, function () {
                                var req, find_res;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            req = ev.target;
                                            if (!!!req.error) return [3 /*break*/, 1];
                                            reject(req.error);
                                            return [3 /*break*/, 4];
                                        case 1:
                                            if (!!!req.result) return [3 /*break*/, 3];
                                            return [4 /*yield*/, ths_2.find(dbName, storeName, req.result, configs_1["default"].KEY_PATH)];
                                        case 2:
                                            find_res = _a.sent();
                                            resolve(find_res);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            reject(new Error(textMessage_1["default"].ErrorSystem));
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                        };
                        request.onerror = function (event) {
                            var req = event.target;
                            reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        reject(e_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * delete
     * @param {string} dbName
     * @param {string} storeName
     * @param {string|number} _pk
     * @returns {Promise<Error|boolean>}
     */
    indexDbOrm.prototype["delete"] = function (dbName, storeName, _pk) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var transaction, request, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this._runDeleteEvent(dbName, storeName, _pk)];
                    case 3:
                        _a.sent();
                        transaction = this._transactionReadWrite(dbName, storeName).objectStore(storeName);
                        request = transaction === null || transaction === void 0 ? void 0 : transaction["delete"](_pk);
                        request.onsuccess = function () {
                            resolve(true);
                        };
                        request.onerror = function (event) {
                            var req = event.target;
                            reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                        };
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _a.sent();
                        reject(e_9);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * find
     * @param {string} dbName
     * @param {string} storeName
     * @param {string|number|array} value
     * @param {string} searchPk
     * @returns {Promise<object>}
     */
    indexDbOrm.prototype.find = function (dbName, storeName, value, searchPk) {
        var _this = this;
        if (searchPk === void 0) { searchPk = null; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var skp, keyRangeValue, result_1, transaction, myIndex, getCursorRequest, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        skp = !!searchPk ? searchPk : configs_1["default"].KEY_PATH;
                        keyRangeValue = this.IDBKeyRange.only(value);
                        result_1 = null;
                        transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        myIndex = transaction.index(skp);
                        getCursorRequest = myIndex.openCursor(keyRangeValue);
                        getCursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor && !!!result_1) {
                                result_1 = cursor.value;
                                cursor["continue"]();
                            }
                            else {
                                resolve(result_1);
                            }
                        };
                        getCursorRequest.onerror = function (event) {
                            console.error(event.error);
                            resolve(null);
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        resolve(null);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * all
     * @param {string} dbName
     * @param {string} storeName
     * @returns {Promise<array>}
     */
    indexDbOrm.prototype.all = function (dbName, storeName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var transaction, request, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        request = transaction === null || transaction === void 0 ? void 0 : transaction.getAll();
                        request.onsuccess = function (event) {
                            var dt = event.target.result;
                            resolve(dt);
                        };
                        request.onerror = function (event) {
                            var req = event.target;
                            reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_11 = _a.sent();
                        reject(e_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * count
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} query
     * @returns {Promise<number>}
     */
    indexDbOrm.prototype.count = function (dbName, storeName, query) {
        var _this = this;
        if (query === void 0) { query = null; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var transaction, request, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        request = transaction === null || transaction === void 0 ? void 0 : transaction.count(query);
                        request.onsuccess = function (event) {
                            var dt = event.target.result;
                            resolve(dt);
                        };
                        request.onerror = function (event) {
                            var req = event.target;
                            reject(!!req.error ? req.error : new Error(textMessage_1["default"].ErrorSystem));
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_12 = _a.sent();
                        reject(e_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * paginate
     * @param {string} dbName
     * @param {string} storeName
     * @param {?number} page
     * @param {?number} total
     * @returns {Promise<array>}
     */
    indexDbOrm.prototype.paginate = function (dbName, storeName, page, total) {
        var _this = this;
        if (page === void 0) { page = 1; }
        if (total === void 0) { total = 20; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var transaction, request, result_2, start_1, hasSkipped_1, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                        request = transaction.openCursor();
                        result_2 = [];
                        start_1 = (page - 1) * total;
                        hasSkipped_1 = false;
                        request.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (!hasSkipped_1 && start_1 > 0) {
                                hasSkipped_1 = true;
                                cursor.advance(start_1);
                                return;
                            }
                            if (cursor) {
                                // @ts-ignore
                                result_2.push(cursor.value);
                                if (result_2.length < total) {
                                    cursor["continue"]();
                                }
                                else {
                                    resolve(result_2);
                                }
                            }
                            else {
                                resolve(result_2);
                            }
                        };
                        request.onerror = function () {
                            resolve([]);
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        e_13 = _a.sent();
                        resolve([]);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * where
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} conditionIndex
     * @param {string} conditionOperator includes : = , > , >= , <= , < ,  between , betweenInclude , like , %like , like% , %like% , match
     * @param {number|string|array} conditionValues
     * @returns {Object}
     */
    indexDbOrm.prototype.where = function (dbName, storeName, conditionIndex, conditionOperator, conditionValues) {
        var addCondition = function (cIndex, cOperator, cValues) {
            whereObject.conditions.push({
                index: cIndex,
                operator: cOperator,
                value: cValues
            });
        };
        var ths = this;
        var whereObject = {
            dbName: dbName,
            storeName: storeName,
            conditions: [],
            orm: ths,
            where: function (cIndex, cOperator, cValues) {
                addCondition(cIndex, cOperator, cValues);
                return whereObject;
            },
            all: function (operation) {
                if (operation === void 0) { operation = 'and'; }
                return whereObject.orm._multiWhere(whereObject.dbName, whereObject.storeName, whereObject.conditions, operation);
            }
        };
        addCondition(conditionIndex, conditionOperator, conditionValues);
        return whereObject;
    };
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
    indexDbOrm.prototype._where = function (dbName, storeName, conditionIndex, conditionOperator, conditionValues) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var keyRangeValue, result_3, cursorConditionOperator, transaction, myIndex, getCursorRequest, conditionStringValue_1, keyPaths_1, transaction, getCursorRequest, e_14;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 3, , 4]);
                        if (!!this._checkActiveDB(dbName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _h.sent();
                        _h.label = 2;
                    case 2:
                        keyRangeValue = null;
                        result_3 = [];
                        cursorConditionOperator = ['like', '%like', 'like%', '%like%', 'match'];
                        switch (conditionOperator) {
                            case "=":
                                keyRangeValue = (_a = this.IDBKeyRange) === null || _a === void 0 ? void 0 : _a.only(conditionValues);
                                break;
                            case ">":
                                keyRangeValue = (_b = this.IDBKeyRange) === null || _b === void 0 ? void 0 : _b.lowerBound(conditionValues, true);
                                break;
                            case ">=":
                                keyRangeValue = (_c = this.IDBKeyRange) === null || _c === void 0 ? void 0 : _c.lowerBound(conditionValues, false);
                                break;
                            case "<":
                                keyRangeValue = (_d = this.IDBKeyRange) === null || _d === void 0 ? void 0 : _d.upperBound(conditionValues, true);
                                break;
                            case "<=":
                                keyRangeValue = (_e = this.IDBKeyRange) === null || _e === void 0 ? void 0 : _e.upperBound(conditionValues, false);
                                break;
                            case "between":
                                if (Array.isArray(conditionValues) && conditionValues.length >= 2) {
                                    keyRangeValue = (_f = this.IDBKeyRange) === null || _f === void 0 ? void 0 : _f.bound(conditionValues[0], conditionValues[1], true, true);
                                }
                                else {
                                    keyRangeValue = null;
                                }
                                break;
                            case "betweenInclude":
                                if (Array.isArray(conditionValues) && conditionValues.length >= 2) {
                                    keyRangeValue = (_g = this.IDBKeyRange) === null || _g === void 0 ? void 0 : _g.bound(conditionValues[0], conditionValues[1], false, false);
                                }
                                else {
                                    keyRangeValue = null;
                                }
                                break;
                            default:
                                keyRangeValue = null;
                                break;
                        }
                        if (!!keyRangeValue) {
                            transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                            myIndex = transaction.index(conditionIndex);
                            getCursorRequest = myIndex.openCursor(keyRangeValue);
                            getCursorRequest.onsuccess = function (event) {
                                var cursor = event.target.result;
                                if (cursor) {
                                    result_3.push(cursor.value);
                                    cursor["continue"]();
                                }
                                else {
                                    resolve(result_3);
                                }
                            };
                            getCursorRequest.onerror = function (event) {
                                console.error(event.error);
                                resolve([]);
                            };
                        }
                        else if (cursorConditionOperator.includes(conditionOperator)) {
                            conditionStringValue_1 = !!conditionValues && typeof conditionValues !== 'object' ? conditionValues.toString() : null;
                            if (!!conditionStringValue_1) {
                                keyPaths_1 = this._getStoreIndexKeyPaths(dbName, storeName, conditionIndex);
                                transaction = this._transactionReadOnly(dbName, storeName).objectStore(storeName);
                                getCursorRequest = transaction.openCursor();
                                getCursorRequest.onsuccess = function (event) {
                                    var cursor = event.target.result;
                                    if (!!cursor && !!cursor.value) {
                                        var searchValues = keyPaths_1.map(function (kp) {
                                            return {
                                                value: !!cursor.value[kp] ? cursor.value[kp] : "",
                                                result: false
                                            };
                                        });
                                        if (conditionOperator === 'like' ||
                                            conditionOperator === '%like%' ||
                                            conditionOperator === '%like' ||
                                            conditionOperator === 'like%' ||
                                            conditionOperator === 'match') {
                                            var re_1 = null;
                                            switch (conditionOperator) {
                                                case "%like":
                                                    re_1 = new RegExp("^(.*){0,}".concat(conditionStringValue_1, "$"), 'i');
                                                    break;
                                                case "%like%":
                                                    re_1 = new RegExp("^(.*){0,}".concat(conditionStringValue_1, "(.*){0,}$"), 'i');
                                                    break;
                                                case "like":
                                                    re_1 = new RegExp("^(.*){0,}".concat(conditionStringValue_1, "(.*){0,}$"), 'i');
                                                    break;
                                                case "like%":
                                                    re_1 = new RegExp("^".concat(conditionStringValue_1, "(.*){0,}$"), 'i');
                                                    break;
                                                case "match":
                                                    re_1 = new RegExp(conditionStringValue_1, 'i');
                                                    break;
                                            }
                                            var resultShare = searchValues.map(function (it) {
                                                return __assign(__assign({}, it), { result: !!it.value && !!re_1 && !!it.value.match(re_1) });
                                            }).reduce(function (res, it) {
                                                return res && it.result;
                                            }, true);
                                            if (resultShare) {
                                                result_3.push(cursor.value);
                                            }
                                        }
                                        else {
                                        }
                                        cursor["continue"]();
                                    }
                                    else {
                                        resolve(result_3);
                                    }
                                };
                                getCursorRequest.onerror = function (event) {
                                    console.error(event.error);
                                    resolve([]);
                                };
                            }
                            else {
                                resolve([]);
                            }
                        }
                        else {
                            resolve([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_14 = _h.sent();
                        resolve([]);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * _multiWhere
     * @param {string} dbName
     * @param {string} storeName
     * @param {array} conditions
     * @param {string} operator
     * @returns {Promise<array>}
     */
    indexDbOrm.prototype._multiWhere = function (dbName, storeName, conditions, operator) {
        if (conditions === void 0) { conditions = []; }
        if (operator === void 0) { operator = 'and'; }
        return __awaiter(this, void 0, void 0, function () {
            var conditionList, result, cacheKeys_1, cacheResult, storeObject, keyPath_1, i, res1, e_15, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        conditionList = Array.isArray(conditions) ? conditions : [];
                        result = [];
                        cacheKeys_1 = [];
                        cacheResult = void 0;
                        storeObject = this.__schema[dbName].stores[storeName];
                        keyPath_1 = storeObject === null || storeObject === void 0 ? void 0 : storeObject.keyPath;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < conditionList.length)) return [3 /*break*/, 7];
                        if (!(!!conditionList[i].index && !!conditionList[i].operator && !!conditionList[i].value)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._where(dbName, storeName, conditionList[i].index, conditionList[i].operator, conditionList[i].value)];
                    case 3:
                        res1 = _a.sent();
                        // @ts-ignore
                        cacheResult = __spreadArray([], res1, true);
                        return [3 /*break*/, 5];
                    case 4:
                        e_15 = _a.sent();
                        cacheResult = [];
                        return [3 /*break*/, 5];
                    case 5:
                        if (i === 0) {
                            result = cacheResult;
                        }
                        else {
                            if (operator === 'or') {
                                result = __spreadArray(__spreadArray([], result, true), cacheResult, true);
                            }
                            else {
                                cacheKeys_1 = cacheResult.map(function (it) { return it[keyPath_1]; });
                                result = result.filter(function (it) {
                                    // @ts-ignore
                                    return cacheKeys_1.includes(it[keyPath_1]);
                                });
                                if (result.length === 0) {
                                    return [3 /*break*/, 7];
                                }
                            }
                        }
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7:
                        if (operator === 'or') {
                            return [2 /*return*/, []];
                        }
                        else {
                            return [2 /*return*/, result];
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} indexName
     * @returns {Array}
     * @private
     */
    indexDbOrm.prototype._getStoreIndexKeyPaths = function (dbName, storeName, indexName) {
        var _a, _b;
        var indexesArray = (_b = (_a = this.__schema[dbName]) === null || _a === void 0 ? void 0 : _a.stores[storeName]) === null || _b === void 0 ? void 0 : _b.indexes;
        if (!!indexesArray) {
            var indexObj = indexesArray.find(function (it) {
                return it.name === indexName;
            });
            if (!!indexObj) {
                if (!!indexObj.keyPath) {
                    if (Array.isArray(indexObj.keyPath)) {
                        return indexObj.keyPath;
                    }
                    else {
                        return [indexObj.keyPath];
                    }
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
        else {
            return [];
        }
    };
    /**
     * _generatePkIndexValue
     * @returns {string}
     * @private
     */
    indexDbOrm.prototype._generatePkIndexValue = function () {
        var rand = Math.ceil(9 * Math.random());
        return Date.now() + '0' + rand;
    };
    /**
     * _insertConvertDataEntry
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} data
     * @returns {object}
     * @private
     */
    indexDbOrm.prototype._insertConvertDataEntry = function (dbName, storeName, data) {
        var store = this.__schema[dbName].stores[storeName];
        var keyPath = store.keyPath;
        var newData = __assign({}, data);
        // primary key check ------------
        //-------------------------------
        if (store.keyPathAuto) {
            if (!(keyPath in newData)) {
                newData[keyPath] = this._generatePkIndexValue();
            }
        }
        newData[configs_1["default"].KEY_PATH] = newData[keyPath];
        return newData;
    };
    /**
     * _updateConvertDataEntry
     * @param {string} dbName
     * @param {string} storeName
     * @param {object} data
     * @returns {object}
     * @private
     */
    indexDbOrm.prototype._updateConvertDataEntry = function (dbName, storeName, data) {
        var store = this.__schema[dbName].stores[storeName];
        var keyPath = store.keyPath;
        return data;
    };
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
    indexDbOrm.prototype.onRebuildDB = function (dbName, event) {
        this.__schema[dbName].onRebuild = event;
        return this;
    };
    /**
     * onInsert
     * @param {string} dbName
     * @param {string} storeName
     * @param {function} event
     */
    indexDbOrm.prototype.onInsert = function (dbName, storeName, event) {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            var key = this._generatePkIndexValue();
            this.__schema[dbName].stores[storeName].onInsert.push({
                key: key,
                event: event
            });
            return key;
        }
    };
    /**
     * onUpdate
     * @param {string} dbName
     * @param {string} storeName
     * @param {function} event
     */
    indexDbOrm.prototype.onUpdate = function (dbName, storeName, event) {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            var key = this._generatePkIndexValue();
            this.__schema[dbName].stores[storeName].onUpdate.push({
                key: key,
                event: event
            });
            return key;
        }
    };
    /**
     * onDelete
     * @param {string} dbName
     * @param {string} storeName
     * @param {function} event
     */
    indexDbOrm.prototype.onDelete = function (dbName, storeName, event) {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            var key = this._generatePkIndexValue();
            this.__schema[dbName].stores[storeName].onDelete.push({
                key: key,
                event: event
            });
            return key;
        }
    };
    /**
     * unbindInsert
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} key
     * @returns {indexDbOrm}
     */
    indexDbOrm.prototype.unbindInsert = function (dbName, storeName, key) {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onInsert) {
            this.__schema[dbName].stores[storeName].onInsert = __spreadArray([], this.__schema[dbName].stores[storeName].onInsert.filter(function (it) { return it.key !== key; }), true);
        }
        return this;
    };
    /**
     * unbindUpdate
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} key
     * @returns {indexDbOrm}
     */
    indexDbOrm.prototype.unbindUpdate = function (dbName, storeName, key) {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onUpdate) {
            this.__schema[dbName].stores[storeName].onUpdate = __spreadArray([], this.__schema[dbName].stores[storeName].onUpdate.filter(function (it) { return it.key !== key; }), true);
        }
        return this;
    };
    /**
     * unbindDelete
     * @param {string} dbName
     * @param {string} storeName
     * @param {string} key
     * @returns {indexDbOrm}
     */
    indexDbOrm.prototype.unbindDelete = function (dbName, storeName, key) {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onDelete) {
            this.__schema[dbName].stores[storeName].onDelete = __spreadArray([], this.__schema[dbName].stores[storeName].onDelete.filter(function (it) { return it.key !== key; }), true);
        }
        return this;
    };
    /**
     * unbindAllInsert
     * @param dbName
     * @param storeName
     * @returns {indexDbOrm}
     */
    indexDbOrm.prototype.unbindAllInsert = function (dbName, storeName) {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            this.__schema[dbName].stores[storeName].onInsert = [];
        }
        return this;
    };
    /**
     * unbindAllUpdate
     * @param dbName
     * @param storeName
     * @returns {indexDbOrm}
     */
    indexDbOrm.prototype.unbindAllUpdate = function (dbName, storeName) {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            this.__schema[dbName].stores[storeName].onUpdate = [];
        }
        return this;
    };
    /**
     * unbindAllDelete
     * @param dbName
     * @param storeName
     * @returns {indexDbOrm}
     */
    indexDbOrm.prototype.unbindAllDelete = function (dbName, storeName) {
        if (dbName in this.__schema && storeName in this.__schema[dbName].stores) {
            this.__schema[dbName].stores[storeName].onDelete = [];
        }
        return this;
    };
    // Private -------------------------------------
    /**
     * _runInsertEvent
     * @param {string} dbName
     * @param {string} storeName
     * @param {Object} data
     * @private
     */
    indexDbOrm.prototype._runInsertEvent = function (dbName, storeName, data) {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onInsert) {
            this.__schema[dbName].stores[storeName].onInsert.map(function (it) {
                it.event(data, it.key);
            });
        }
    };
    /**
     * _runUpdateEvent
     * @param {string} dbName
     * @param {string} storeName
     * @param {Object} newData
     * @param {Object} lastData
     * @private
     */
    indexDbOrm.prototype._runUpdateEvent = function (dbName, storeName, newData, lastData) {
        if (dbName in this.__schema &&
            storeName in this.__schema[dbName].stores &&
            !!this.__schema[dbName].stores[storeName].onUpdate) {
            this.__schema[dbName].stores[storeName].onUpdate.map(function (it) {
                it.event(newData, lastData, it.key);
            });
        }
    };
    /**
     * _runUpdateEvent
     * @param {string} dbName
     * @param {string} storeName
     * @param {string|number} pk
     * @private
     */
    indexDbOrm.prototype._runDeleteEvent = function (dbName, storeName, pk) {
        return __awaiter(this, void 0, void 0, function () {
            var data_1, e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(dbName in this.__schema &&
                            storeName in this.__schema[dbName].stores &&
                            !!this.__schema[dbName].stores[storeName].onUpdate)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.find(dbName, storeName, pk)];
                    case 2:
                        data_1 = _a.sent();
                        this.__schema[dbName].stores[storeName].onDelete.map(function (it) {
                            it.event(data_1, it.key);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_16 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ORM Operation Functions ------------------
    // Public -----------------------------------
    /**
     * build
     * @returns {Promise<indexDbOrm>}
     */
    indexDbOrm.prototype.build = function () {
        var _this = this;
        this._addOrmDB();
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _i, i, res, status_1, e_17, e_18, i, e_19;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 15, , 16]);
                        _a = [];
                        for (_b in this.__schema)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 14];
                        i = _a[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 12, , 13]);
                        return [4 /*yield*/, this._setCurrentVersionOnSchema(i)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this._openDB(i)];
                    case 4:
                        res = _c.sent();
                        if (!((res === null || res === void 0 ? void 0 : res.type) === 'upgrade')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._createDbStores(i)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [4 /*yield*/, this._compareStoresToVersionChange(i)];
                    case 7:
                        status_1 = _c.sent();
                        if (!!status_1) return [3 /*break*/, 11];
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this._rebuildDB(i)];
                    case 9:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        e_17 = _c.sent();
                        console.error(e_17);
                        return [3 /*break*/, 11];
                    case 11:
                        this._addDataBaseToClass(i);
                        return [3 /*break*/, 13];
                    case 12:
                        e_18 = _c.sent();
                        return [3 /*break*/, 13];
                    case 13:
                        _i++;
                        return [3 /*break*/, 1];
                    case 14:
                        for (i in this.__schema) {
                            this._rebuildDBEvent(i);
                        }
                        resolve(this);
                        return [3 /*break*/, 16];
                    case 15:
                        e_19 = _c.sent();
                        reject(e_19);
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        }); });
    };
    // Private ----------------------------------
    indexDbOrm.prototype._addOrmDB = function () {
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
    };
    /**
     * _setCurrentVersionOnSchema
     * @param dbName
     * @returns {Promise<number>}
     * @private
     */
    indexDbOrm.prototype._setCurrentVersionOnSchema = function (dbName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, e_20;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this.__schema[dbName];
                        return [4 /*yield*/, this.getDataBaseVersion(dbName)];
                    case 1:
                        _a.currentVersion = _b.sent();
                        resolve(this.__schema[dbName].currentVersion);
                        return [3 /*break*/, 3];
                    case 2:
                        e_20 = _b.sent();
                        resolve(1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * _compareStoresToVersionChange
     * @param {string} dbName
     * @returns {Promise<boolean>}
     * @private
     */
    indexDbOrm.prototype._compareStoresToVersionChange = function (dbName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var dbObject, stores, orgStores, status_2, i, e_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!!!this.__schema[dbName].db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        dbObject = this.__schema[dbName];
                        stores = dbObject.stores;
                        orgStores = __spreadArray([], dbObject.db.objectStoreNames, true);
                        status_2 = true;
                        for (i in stores) {
                            if (!orgStores.includes(i)) {
                                console.error("not found store \"".concat(i, "\" in \"").concat(dbName, "\" database"));
                            }
                            status_2 = status_2 && orgStores.includes(i);
                        }
                        resolve(status_2);
                        return [3 /*break*/, 4];
                    case 3:
                        e_21 = _a.sent();
                        console.error(e_21);
                        resolve(false);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * _rebuildDB
     * @param {string} dbName
     * @returns {Promise<boolean|Error>}
     * @private
     */
    indexDbOrm.prototype._rebuildDB = function (dbName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, e_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this._closeDB(dbName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.removeDataBase(dbName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._openDB(dbName)];
                    case 3:
                        res = _a.sent();
                        if (!((res === null || res === void 0 ? void 0 : res.type) === 'upgrade')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._createDbStores(dbName)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        resolve(true);
                        return [3 /*break*/, 7];
                    case 6:
                        e_22 = _a.sent();
                        reject(e_22);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    return indexDbOrm;
}());
exports["default"] = indexDbOrm;
