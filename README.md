# index-db-orm

<!-- BEGIN LATEST BADGE -->
[![Download zip](https://custom-icon-badges.herokuapp.com)
<!-- END LATEST BADGE -->

Promise based using indexDb for the browser.


## Features

- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- Supports test mode
- Simple syntax

## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | No |


## Installing

Using npm:

```bash
$ npm install index-db-orm
```

Using yarn:

```bash
$ yarn add index-db-orm
```

## Example

### note: CommonJS usage

```js
const ormClass = require('index-db-orm').default;

```
build dataBase and stores

```js
const ormClass = require('index-db-orm').default;

const orm = new ormClass();

orm.addDB({
        name: 'database1',
        stores: [
            {
                name: 'db1store1',
                indexes: [
                    {name: 'name', keyPath: 'name', option: {unique: false}},
                    {name: 'key', keyPath: 'key', option: {unique: true}},
                    {name: 'multiIndex', keyPath: ['name', 'key'], option: {unique: false}},
                ]
            },
            {
                name: 'db1store2',
                indexes: [
                    {name: 'name', keyPath: 'name', option: {unique: false}},
                ]
            },
        ]
    })
    .addDB({
        name: 'database2',
        stores: [
            {name: 'db2store1', indexes: []},
            {name: 'db2store2', keyPath: 'userId', indexes: []},
        ]
    })
    .build()
    .then(function (res) {
        console.log('on ready');
    })
    .catch(function (err) {
        console.error(err);
    });

    // Want to use async/await? Add the `async` keyword to your outer function/method.

    async function build() {
        try{
            const buildRes = orm
            .addDB({ ... })
            // .....
            .build()

             console.log('on ready');
        }catch(error){
            console.error(err);
        }
    }

```

> **NOTE:** `async/await` is part of ECMAScript 2017 and is not supported in Internet
> Explorer and older browsers, so use with caution.

after build, can use crud operator.

Performing a `Insert` request

```js
orm.insert('database1', 'db1store1', {
    'name': 'test name',
    'key': 'key 1',
    // add other key, value 
}).then(function (res) {
    console.log('on insert complete');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.insert(data) <promise>

orm.database1.db1store1.insert({
    'name': 'test name',
    'key': 'key 1',
    // add other key, value 
}).then(function (res) {
    console.log('on insert complete');
})
.catch(function (err) {
    console.error(err);
});
```

Performing a `Update` request

```js
orm.update('database1', 'db1store1', {
    '__pk': '<row key>',
    'name': 'test name',
    'key': 'key 1',
    // add other key, value 
}).then(function (res) {
    console.log('on update complete');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.update(data) <promise>

orm.database1.db1store1.update({
    '__pk': '<row key>',
    'name': 'test name',
    'key': 'key 1',
    // add other key, value 
}).then(function (res) {
    console.log('on update complete');
})
.catch(function (err) {
    console.error(err);
});
```

Performing a `Delete` request

```js
orm.delete('database1', 'db1store1', '<row key>')
.then(function (res) {
    console.log('on delete complete');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.delete(pk) <promise>

orm.database1.db1store1.delete('<row key>')
.then(function (res) {
    console.log('on delete complete');
})
.catch(function (err) {
    console.error(err);
});
```

Performing a `Find` request

```js
orm.find('database1', 'db1store1','<row key>')
.then(function (res) {
    console.log('on find row complete');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.find(<row key>) <promise>

orm.database1.db1store1.find('<row key>')
.then(function (res) {
    console.log('on find row complete');
})
.catch(function (err) {
    console.error(err);
});

```

Performing a `Select all` request

```js
orm.all('database1', 'db1store1')
.then(function (res) {
    console.log('on all select complete');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.all() <promise>

orm.database1.db1store1.all()
.then(function (res) {
    console.log('on all select complete');
})
.catch(function (err) {
    console.error(err);
});

```

Performing a `Select as paginate` request

```js
orm.paginate('database1', 'db1store1',1,10)
.then(function (res) {
    console.log('on paginate select complete');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.paginate(<?page number>,<?limit row>) <promise>

orm.database1.db1store1.paginate(1,10)
.then(function (res) {
    console.log('on paginate select complete');
})
.catch(function (err) {
    console.error(err);
});

```

Performing a `Where` request

```js
orm.where('database1', 'db1store1','name','=','test name').all()
.then(function (res) {
    console.log('on where complete select');
})
.catch(function (err) {
    console.error(err);
});

// Want to use directive mode
// orm.<db name>.<store name>.paginate(<?page number>,<?limit row>) <promise>

orm.database1.db1store1.where('name','=','test name').all()
.then(function (res) {
    console.log('on where complete select');
})
.catch(function (err) {
    console.error(err);
});

```

As can use `more where` request too

```js
orm.where('database1', 'db1store1','name','=','test name')
    .where('database1', 'db1store1','key','=','key 1')
    .all()
    .then(function (res) {
        console.log('on where complete select');
    })
    .catch(function (err) {
        console.error(err);
    });

// Want to use directive mode
// orm.<db name>.<store name>.paginate(<?page number>,<?limit row>) <promise>

orm.database1.db1store1.where('name','=','test name')
    .where('database1', 'db1store1','key','=','key 1').all()
    .then(function (res) {
        console.log('on where complete select');
    })
    .catch(function (err) {
        console.error(err);
    });

```

## ORM API

### Use
For use orm, must be create a instance of class.
instance of class as two mode `product` (default) , `test`.
in test mode using of [fake-indexeddb](https://www.npmjs.com/package/fake-indexeddb) for test.

```js
const ormClass = require('index-db-orm').default;

const orm = new ormClass('product'); // product mode
const orm = new ormClass('test'); // test mode
```

### Build DataBase and Stores
After created instance, must be mapping of database and stores to instance.

```js
orm
    .addDB({
        name: 'dbName', // {string} dbName
        stores: [
            {
                name: "storeName1", // {string} storeName
                indexes: [
                    {
                        name: 'indexName',  // {string} indexName 
                        keyPath: 'keyPath', // {string, array<string>} keyPath 
                        option: {
                            unique: false
                        } // {Object}  indexOption , default {unique: false}
                    },
                    // add more index
                ]
            },
            // add more store
        ],
        onRebuild: function(){

        }, // {function} onRebuild , event run when database need updated
    })
    // add more DB
    .build()
    .then((response)=>{
        console.log('build db complete!!!')
    })
    .catch((error)=>{
        console.error('build error')
    })
```

also you can use `onRebuild` as 

```js
orm.onRebuildDB("dataBaseName", function () {
  console.log("rebuild event )))))))))))))))))))))");
})
```

### DataBase API

| method name           | input           | output                | description |
| :------------         |   :---          | :--------              | :--------   |
| `getAllDatabases`     |                 | `promise <array>`      | return all database list        |
| `getDataBase`         | `{string} name` | `promise <object>`     | return a database info by name  |
| `getDataBaseVersion`  | `{string} name` | `promise <number>`     | return a database version by name  |
| `removeAllDataBase`   |                 | `promise <orm>`        | remove all database            |
| `removeDataBase`      | `{string} name` | `promise <orm>`        | remvoe database by name            |
| `onRebuildDB`         | `{string} name` , `{function} event`     | `orm`        | set event, active this event when database will updated            |

### Store API

| method name      | input                                    | output               | description |
| :------------    |   :---                                   | :--------              | :--------   |
| `clearStore`     | `{string} dbName` , `{string} storeName` | `promise <boolean>`    | clear store by name   |
| `insert`         | `{string} dbName` , `{string} storeName` , `{object} data` | `promise <object>`    | insert data to store, `promise <object>` include __pk key   |
| `update`         | `{string} dbName` , `{string} storeName` , `{object} data` | `promise <object>`    | store update, `data` must include __pk key   |
| `delete`         | `{string} dbName` , `{string} storeName` , `{string,number} __pk` | `promise <boolean>`    | delete data from store   |
| `find`           | `{string} dbName` , `{string} storeName` , `{string,number,array} vlaue` , `?{string} searchPk(=null)` | `promise <boolean>`    | find row in store by pk. `searchPk` must be include one of store indexes name   |
| `all`            | `{string} dbName` , `{string} storeName` | `promise <array>`    |  return all row as array  |
| `paginate`       | `{string} dbName` , `{string} storeName` , `?{number} page (= 1)` , `?{number} total (= 20)` | `promise <array>`    |  return row as paginate mode  |
| `count`          | `{string} dbName` , `{string} storeName` , `?{object} query (= null)` | `promise <numer>`    |  return count row  |
| `where`          | `{string} dbName` , `{string} storeName` , `{string} conditionIndex` , `{string} conditionOperator` , `{number, string, array} conditionValues` | `object{build()}`    |  return all row by condition. `conditionIndex` must be include one of store indexes name. `conditionOperator` must include one of `=` , `>` , `>=` , `<=` , `<` ,  `between` , `betweenInclude` , `like` , `%like` , `like%` , `%like%` , `match` |
| `where().build()`| `{string} operation` | `promise <array>`  | `operation` include one of `and` , `or` |
| `onInsert`       | `{string} dbName` , `{string} storeName` ,  `{function} event`  | `{string, number} eventKey`    | set event, active this event when insert data to store   |
| `onUpdate`       | `{string} dbName` , `{string} storeName` ,  `{function} event`  | `{string, number} eventKey`    | set event, active this event when update row of store   |
| `onDelete`       | `{string} dbName` , `{string} storeName` ,  `{function} event`  | `{string, number} eventKey`    | set event, active this event when delete row from store   |
| `unbindInsert`   | `{string} dbName` , `{string} storeName` ,  `{string, number} keyEvent`  | `{object} orm`    | remove `onInsert` event    |
| `unbindUpdate`   | `{string} dbName` , `{string} storeName` ,  `{string, number} keyEvent`  | `{object} orm`    | remove `onUpdate` event    |
| `unbindDelete`   | `{string} dbName` , `{string} storeName` ,  `{string, number} keyEvent`  | `{object} orm`    | remove `onDelete` event    |
| `unbindAllInsert`| `{string} dbName` , `{string} storeName`   | `{object} orm`    | remove `onInsert` all event    |
| `unbindAllUpdate`| `{string} dbName` , `{string} storeName`   | `{object} orm`    | remove `onUpdate` all event    |
| `unbindAllDelete`| `{string} dbName` , `{string} storeName`   | `{object} orm`    | remove `onDelete` all event    |


### Direct Call Store API
| directive Call   | method    |
| :------------    | :---      |
| `orm.<dbName>.<storeName>`.`insert(data)` | `orm.insert(dbName,storeName,data)` |
| `orm.<dbName>.<storeName>`.`update(data)` | `orm.update(dbName,storeName,data)` |
| `orm.<dbName>.<storeName>`.`delete(__pk)` | `orm.delete(dbName,storeName,__pk)` |
| `orm.<dbName>.<storeName>`.`find(value, searchPk)` | `orm.find(dbName,storeName,value, searchPk)` |
| `orm.<dbName>.<storeName>`.`all()` | `orm.all(dbName,storeName)` |
| `orm.<dbName>.<storeName>`.`count()` | `orm.count(dbName,storeName)` |
| `orm.<dbName>.<storeName>`.`paginate(page, total)` | `orm.paginate(dbName,storeName,page, total)` |
| `orm.<dbName>.<storeName>`.`orm.where(conditionIndex,conditionOperator,conditionValues)` | `orm.where(dbName,storeName,conditionIndex,conditionOperator,conditionValues)` |
| `orm.<dbName>.<storeName>`.`orm.where..where...build(operation)` | `orm.where()..where()...build(operation)` |
| `orm.<dbName>.<storeName>`.`onInsert(event)` | `orm.onInsert(dbName,storeName,event)` |
| `orm.<dbName>.<storeName>`.`onUpdate(event)` | `orm.onUpdate(dbName,storeName,event)` |
| `orm.<dbName>.<storeName>`.`onDelete(event)` | `orm.onDelete(dbName,storeName,event)` |
| `orm.<dbName>.<storeName>`.`unbindInsert(keyEvent)` | `orm.unbindInsert(dbName,storeName,keyEvent)` |
| `orm.<dbName>.<storeName>`.`unbindUpdate(keyEvent)` | `orm.unbindUpdate(dbName,storeName,keyEvent)` |
| `orm.<dbName>.<storeName>`.`unbindDelete(keyEvent)` | `orm.unbindDelete(dbName,storeName,keyEvent)` |
| `orm.<dbName>.<storeName>`.`unbindAllInsert()` | `orm.unbindAllInsert(dbName,storeName)` |
| `orm.<dbName>.<storeName>`.`unbindAllUpdate()` | `orm.unbindAllUpdate(dbName,storeName)` |
| `orm.<dbName>.<storeName>`.`unbindAllDelete()` | `orm.unbindAllDelete(dbName,storeName)` |
