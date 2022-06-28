import {afterAll, afterEach, describe, expect, jest} from "@jest/globals";
import ormClass from "../src/index";
import configs from "../src/modules/helper/configs";

const db_schema_1 = {
    name: "testDataBase",
    stores: [
        {
            name: "store1",
            keyPath: 'id',
            indexes: [
                {name: 'index1', keyPath: 'key1', option: {unique: false}},
                {name: 'index2', keyPath: 'key2', option: {unique: false}},
                {name: 'index3', keyPath: ['key3', 'key4'], option: {unique: false}},
            ]
        },
        {
            name: "store2",
            indexes: [
                {name: 'index1', keyPath: 'key1', option: {unique: true}},
                {name: 'index2', keyPath: 'key2', option: {unique: false}},
                {name: 'index3', keyPath: ['key3', 'key4'], option: {unique: false}},
            ]
        },
        {
            name: "store3",
            indexes: [
                {name: 'index1', keyPath: 'key1', option: {unique: false}},
                {name: 'index2', keyPath: 'key2', option: {unique: false}},
                {name: 'index3', keyPath: 'key3', option: {unique: false}},
                {name: 'index4', keyPath: 'key4', option: {unique: false}},
                {name: 'index6', keyPath: 'key6', option: {unique: false}},
                {name: 'index5', keyPath: ['key3','key4'], option: {unique: false}},
            ]
        }
    ]
};


// helper function ----------------------
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
//--------------------------------------


const orm = new ormClass('test');

let totalResult = {};

describe('store', () => {

    test('add database and stores', async () => {
        try {
            let resOrm = await orm.addDB(db_schema_1).build();
            expect(
                !!resOrm.__schema?.testDataBase?.db &&
                !!resOrm.__schema?.testDataBase?.stores?.store1 &&
                !!resOrm.__schema?.testDataBase?.stores?.store2 &&
                !!resOrm?.testDataBase &&
                !!resOrm?.testDataBase?.store1 &&
                !!resOrm?.testDataBase?.store2
            ).toBeTruthy();

        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    //--------------------------------------------------
    // curd test ---------------------------------------
    //--------------------------------------------------

    //--------------------------------------------------
    // insert ------------------------------------------
    //--------------------------------------------------

    test('insert : mistake database', async () => {
        try {
            await orm.insert("mistakeDatabase", "store1", {
                id: 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('insert : mistake store', async () => {

        try {
            await orm.insert("testDataBase", "mistake1", {
                id: 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('insert : simple insert data - default keyPath', async () => {
        try {
            let res = await orm.insert("testDataBase", "store2", {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            totalResult['insert_2_1'] = res;
            expect(!!res[configs.KEY_PATH]).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('insert : simple insert data - uniq index value', async () => {
        try {
            let res = await orm.insert("testDataBase", "store2", {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(!!!res[configs.KEY_PATH]).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('insert : simple insert data - custom keyPath', async () => {
        try {
            let res = await orm.insert("testDataBase", "store1", {
                id : 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            totalResult['insert_1_1'] = res;
            expect(!!res.id).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('insert : simple insert data - uniq custom keyPath', async () => {
        try {
            let res = await orm.insert("testDataBase", "store1", {
                id : 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('insert : simple insert data - un pass custom keyPath', async () => {
        try {
            let res = await orm.insert("testDataBase", "store1", {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });


    test('direct insert : mistake database', async () => {
        try {
            await orm.mistakeDatabase.store1.insert({
                id: 2,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "dddd",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct insert : mistake store', async () => {

        try {
            await orm.testDataBase.mistake1.insert({
                id: 2,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "dddd",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct insert : simple insert data - default keyPath', async () => {
        try {
            let res = await orm.testDataBase.store2.insert( {
                key1: "abc2",
                key2: 0,
                key3: 100000,
                key4: "cde2",
            });
            totalResult['insert_2_2'] = res;
            expect(!!res[configs.KEY_PATH]).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct insert : simple insert data - uniq index value', async () => {
        try {
            let res = await orm.testDataBase.store2.insert({
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde2",
            });
            expect(!!!res[configs.KEY_PATH]).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct insert : simple insert data - custom keyPath', async () => {
        try {
            let res = await orm.testDataBase.store1.insert( {
                id : 3,
                key1: "abc3",
                key2: 0,
                key3: 100000,
                key4: "cde3",
            });
            totalResult['insert_1_2'] = res;
            expect(!!res.id).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct insert : simple insert data - uniq custom keyPath', async () => {
        try {
            let res = await orm.testDataBase.store1.insert( {
                id : 2,
                key1: "abc2",
                key2: 0,
                key3: 100000,
                key4: "cde2",
            });
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct insert : simple insert data - un pass custom keyPath', async () => {
        try {
            let res = await orm.testDataBase.store1.insert({
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    //--------------------------------------------------
    // update ------------------------------------------
    //--------------------------------------------------

    test('update : mistake database', async () => {
        try {
            await orm.update("mistakeDatabase", "store1", {
                id: 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('update : mistake store', async () => {

        try {
            await orm.update("testDataBase", "mistake1", {
                id: 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('update : simple update data - default keyPath', async () => {
        try {
            let res = await orm.update("testDataBase", "store2", {
                ...totalResult['insert_2_1'],
                key3 : 1010,
                key2 : 10
            });
            totalResult['update_2_1'] = res;
            expect(res.key2 === 10 && res.key3 === 1010).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('update : simple update data - uniq index value', async () => {
        try {
            let data = { ...totalResult['insert_2_2']};
            data[configs.KEY_PATH] =  totalResult['insert_2_1'][configs.KEY_PATH];
            let res = await orm.update("testDataBase", "store2", {...data});
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('update : simple update data - custom keyPath', async () => {
        try {
            let res = await orm.update("testDataBase", "store1", {
                ...totalResult['insert_1_1'],
                key1: "abc1010",
                key2: 1010,
                key3: 1011,
                key4: "cde1011",
            });
            totalResult['update_1_1'] = res;
            expect(
                res.key1 === "abc1010" &&
                res.key2 === 1010 &&
                res.key3 === 1011 &&
                res.key4 === "cde1011"
            ).toBeTruthy();

        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('update : simple update data - not exist uniq custom keyPath', async () => {
        try {
            let data = {
                id : 100,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            };

            data[configs.KEY_PATH] = 100;


            let res = await orm.update("testDataBase", "store1", data);
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('update : simple update data - un pass custom keyPath', async () => {
        try {
            let res = await orm.update("testDataBase", "store1", {
                id : 2,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });


    test('direct update : mistake database', async () => {
        try {
            await orm.mistakeDatabase.store1.update( {
                id: 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct update : mistake store', async () => {

        try {
            await orm.testDataBase.mistake1.update({
                id: 1,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct update : simple update data - default keyPath', async () => {
        try {
            let res = await orm.testDataBase.store2.update({
                ...totalResult['insert_2_1'],
                key3 : 1011,
                key2 : 110
            });
            totalResult['update_2_1'] = res;
            expect(res.key2 === 110 && res.key3 === 1011).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct update : simple update data - uniq index value', async () => {
        try {
            let data = { ...totalResult['insert_2_2']};
            data[configs.KEY_PATH] =  totalResult['insert_2_1'][configs.KEY_PATH];
            let res = await orm.testDataBase.store2.update( {...data});
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct update : simple update data - custom keyPath', async () => {
        try {
            let res = await orm.testDataBase.store1.update({
                ...totalResult['insert_1_1'],
                key1: "abc1010",
                key2: 1010,
                key3: 1011,
                key4: "cde1011",
            });
            totalResult['update_1_1'] = res;
            expect(
                res.key1 === "abc1010" &&
                res.key2 === 1010 &&
                res.key3 === 1011 &&
                res.key4 === "cde1011"
            ).toBeTruthy();

        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct update : simple update data - not exist uniq custom keyPath', async () => {
        try {
            let data = {
                id : 100,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            };

            data[configs.KEY_PATH] = 100;


            let res = await orm.testDataBase.store1.update( data);
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct update : simple update data - un pass custom keyPath', async () => {
        try {
            let res = await orm.testDataBase.store1.update({
                id : 2,
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            expect(!!!res.id).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    //--------------------------------------------------
    // delete ------------------------------------------
    //--------------------------------------------------

    test('delete : mistake database', async () => {
        try {
            await orm.delete("mistakeDatabase", "store1", totalResult['insert_1_1'].__pk);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('delete : mistake store', async () => {
        try {
            await orm.delete("testDataBase", "mistake1", totalResult['insert_1_1'].__pk);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('delete : simple delete data - default keyPath', async () => {
        try {
            let res = await orm.delete("testDataBase", "store2", totalResult['insert_2_1'].__pk);
            expect(res).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('delete : simple delete data - mistake keyPath', async () => {
        try {
            let res = await orm.delete("testDataBase", "store2", totalResult['insert_2_1'].__pk);
            expect(!res).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });


    test('direct delete : mistake database', async () => {
        try {
            await orm.mistakeDatabase.store1(totalResult['insert_1_2'].__pk);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct delete : mistake store', async () => {
        try {
            await orm.testDataBase.mistake1.delete( totalResult['insert_1_2'].__pk);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct delete : simple delete data - default keyPath', async () => {
        try {
            let res = await orm.testDataBase.store2.delete(totalResult['insert_2_2'].__pk);
            expect(res).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct delete : simple delete data - mistake keyPath', async () => {
        try {
            let res = await orm.testDataBase.store2.delete(totalResult['insert_2_2'].__pk);
            expect(!res).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });


    //--------------------------------------------------
    // clear store -------------------------------------
    //--------------------------------------------------

    test('clear store  : mistake database', async () => {
        try {
            let res = await orm.clearStore("mistakeDatabase", "store1");
            expect(!res).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('clear store  : mistake store', async () => {
        try {
            let res = await orm.clearStore("testDataBase", "mistake1");
            expect(!res).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('clear store ', async () => {
        try {
            let lastGetAll = await orm.all("testDataBase", "store1");
            await orm.clearStore("testDataBase", "store1");
            let afterGetAll = await orm.all("testDataBase", "store1");
            expect(afterGetAll.length === 0).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    test('direct clear store  : mistake database', async () => {
        try {
            let res = await orm.mistakeDatabase.store1.clear();
            expect(!res).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct clear store  : mistake store', async () => {
        try {
            let res = await orm.testDataBase.mistake1.clear();
            expect(!res).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct clear store ', async () => {
        try {
            let lastGetAll = await orm.testDataBase.store2.all();
            await orm.testDataBase.store2.clear();
            let afterGetAll = await orm.testDataBase.store2.all();
            expect(afterGetAll.length === 0).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    //--------------------------------------------------
    // find---------------------------------------------
    //--------------------------------------------------

    test('find : mistake database', async () => {
        try {
            await orm.find("mistakeDatabase", "store1", 1);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('find : mistake store', async () => {
        try {
            await orm.find("testDataBase", "mistake1", 1);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('find : simple test', async () => {
        try {
            await orm.clearStore("testDataBase", "store2");
            let resInsert = await orm.insert("testDataBase", "store2", {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            let resFind = await orm.find("testDataBase", "store2", resInsert.__pk);
            expect(resFind.key1 === 'abc' && resFind.key2 === 0 && resFind.key3 === 100000 && resFind.key4 === 'cde').toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('find : multi insert', async () => {
        try {
            await orm.clearStore("testDataBase", "store2");
            let resInsert1 = await orm.insert("testDataBase", "store2", {
                key1: "a1",
                key2: 1,
                key3: 10,
                key4: "c1",
            });
            let resInsert2 = await orm.insert("testDataBase", "store2", {
                key1: "a2",
                key2: 2,
                key3: 11,
                key4: "c2",
            });
            let resInsert3 = await orm.insert("testDataBase", "store2", {
                key1: "a3",
                key2: 3,
                key3: 111,
                key4: "c3",
            });
            let resFind = await orm.find("testDataBase", "store2", resInsert2.__pk);
            expect(resFind.key1 === 'a2' && resFind.key2 === 2 && resFind.key3 === 11 && resFind.key4 === 'c2').toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('find : simple test find primary key', async () => {
        try {
            await orm.clearStore("testDataBase", "store2");
            let resInsert = await orm.insert("testDataBase", "store2", {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            let resFind = await orm.find("testDataBase", "store2", 'abc' , 'index1');
            expect(resFind.key1 === 'abc' && resFind.key2 === 0 && resFind.key3 === 100000 && resFind.key4 === 'cde').toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    test('direct find : mistake database', async () => {
        try {
            await orm.mistakeDatabase.store1.find(1);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct find : mistake store', async () => {
        try {
            await orm.testDataBase.mistake1.find(1);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct find : simple test', async () => {
        try {
            await orm.testDataBase.store2.clear();
            let resInsert = await orm.testDataBase.store2.insert( {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            let resFind = await orm.testDataBase.store2.find(resInsert.__pk);
            expect(resFind.key1 === 'abc' && resFind.key2 === 0 && resFind.key3 === 100000 && resFind.key4 === 'cde').toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct find : multi insert', async () => {
        try {
            await orm.testDataBase.store2.clear();
            let resInsert1 = await orm.testDataBase.store2.insert({
                key1: "a1",
                key2: 1,
                key3: 10,
                key4: "c1",
            });
            let resInsert2 = await orm.testDataBase.store2.insert({
                key1: "a2",
                key2: 2,
                key3: 11,
                key4: "c2",
            });
            let resInsert3 = await orm.testDataBase.store2.insert({
                key1: "a3",
                key2: 3,
                key3: 111,
                key4: "c3",
            });
            let resFind = await orm.testDataBase.store2.find(resInsert2.__pk);
            expect(resFind.key1 === 'a2' && resFind.key2 === 2 && resFind.key3 === 11 && resFind.key4 === 'c2').toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct find : simple test find primary key', async () => {
        try {
            await orm.testDataBase.store2.clear();
            let resInsert = await orm.testDataBase.store2.insert( {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            let resFind = await orm.testDataBase.store2.find( 'abc' , 'index1');
            expect(resFind.key1 === 'abc' && resFind.key2 === 0 && resFind.key3 === 100000 && resFind.key4 === 'cde').toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    //--------------------------------------------------
    // all & count -------------------------------------
    //--------------------------------------------------

    test('all & count : mistake database', async () => {
        try {
            await orm.all("mistakeDatabase", "store1");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }

        try {
            await orm.count("mistakeDatabase", "store1");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('all & count : mistake store', async () => {
        try {
            await orm.all("testDataBase", "mistake1");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }

        try {
            await orm.count("testDataBase", "mistake1");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('all & count : simple test', async () => {
        try {
            await orm.clearStore("testDataBase", "store2");
            let resInsert = await orm.insert("testDataBase", "store2", {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            let resFind = await orm.all("testDataBase", "store2");

            let resCount = await orm.count("testDataBase", "store2");
            expect(resFind.length === resCount).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('all & count : count simple test', async () => {
        try {
            await orm.clearStore("testDataBase", "store2");
            const maxCount = 12;

            for (let i =0 ; i < maxCount ; i++){
                await orm.insert("testDataBase", "store2", {
                    key1: i,
                    key2: i,
                    key3: 100000+i,
                    key4: i
                });

                await new Promise((r) => setTimeout(r, 100));
            }

            let resFind = await orm.all("testDataBase", "store2");

            let resCount = await orm.count("testDataBase", "store2");

            expect(resFind.length === maxCount && resCount === maxCount).toBeTruthy();

        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    test('direct all & count : mistake database', async () => {
        try {
            await orm.mistakeDatabase.store1.all();
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct all & count : mistake store', async () => {
        try {
            await orm.testDataBase.mistake1.all();
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }

        try {
            await orm.testDataBase.mistake1.count();
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct all & count : simple test', async () => {
        try {
            await orm.testDataBase.store2.clear();
            let resInsert = await orm.testDataBase.store2.insert( {
                key1: "abc",
                key2: 0,
                key3: 100000,
                key4: "cde",
            });
            let resFind = await orm.testDataBase.store2.all();
            let resCount = await orm.testDataBase.store2.count();
            expect(resFind.length === resCount).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('direct all & count : count simple test', async () => {
        try {

            await orm.testDataBase.store2.clear();
            const maxCount = 12;

            for (let i =0 ; i < maxCount ; i++){
                await orm.testDataBase.store2.insert( {
                    key1: (2*i),
                    key2: (2*i),
                    key3: 10+(2*i),
                    key4: (2*i)
                });

                await new Promise((r) => setTimeout(r, 100));
            }

            let resFind = await orm.testDataBase.store2.all();
            let resCount = await orm.testDataBase.store2.count();
            expect(resFind.length === maxCount && resCount === maxCount).toBeTruthy();

            expect(true).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    //--------------------------------------------------
    // lazy --------------------------------------------
    //--------------------------------------------------

    test('pagination : mistake database', async () => {
        try {
            await orm.pagination("mistakeDatabase", "store1");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('pagination : mistake store', async () => {
        try {
            await orm.pagination("testDataBase", "mistake1");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('pagination : simple test', async () => {
        try {
            await orm.clearStore("testDataBase", "store2");
            const maxCount = 42;

            for (let i =0 ; i < maxCount ; i++){
                await orm.insert("testDataBase", "store2", {
                    key1: i,
                    key2: i,
                    key3: 100000+i,
                    key4: i
                });

                await new Promise((r) => setTimeout(r, 100));
            }



            let pg_count = 0;
            for (let i=0; i<20;i++){
                let pg = await orm.paginate("testDataBase", "store2",i+1,20);
                pg_count += pg.length;
            }

            expect(pg_count === maxCount).toBeTruthy();

        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy();
        }
    });


    test('direct pagination : mistake database', async () => {
        try {
            await orm.mistakeDatabase.store2.paginate();
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct pagination : mistake store', async () => {
        try {
            await orm.testDataBase.store5.paginate();
            expect(false).toBeTruthy();
        } catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('direct pagination : simple test', async () => {
        try {
            await orm.testDataBase.store2.clear();
            const maxCount = 42;

            for (let i =0 ; i < maxCount ; i++){
                await orm.testDataBase.store2.insert({
                    key1: i,
                    key2: i,
                    key3: 100000+i,
                    key4: i
                });

                await new Promise((r) => setTimeout(r, 100));
            }



            let pg_count = 0;
            for (let i=0; i<20;i++){
                let pg = await orm.testDataBase.store2.paginate(i+1,20);
                pg_count += pg.length;
            }

            expect(pg_count === maxCount).toBeTruthy();

        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy();
        }
    });


    //--------------------------------------------------
    // where -------------------------------------------
    //--------------------------------------------------

    test('where : test by condition  = , > , >= , < , <= , like , multiWhere ', async () => {
        try {
            await orm.clearStore("testDataBase", "store3");

            const maxCount = 100;
            let dataList = [];

            for (let i =0 ; i < maxCount ; i++){

                let data = {
                    key1: Math.ceil(100*Math.random()),
                    key2: Math.ceil(100*Math.random()),
                    key3: Math.ceil(100*Math.random()),
                    key4: Math.ceil(100*Math.random()),
                    key6: generateString(Math.ceil(15*Math.random())),
                };

                await orm.insert("testDataBase", "store3", data);

                await new Promise((r) => setTimeout(r, 100));
            }

            await new Promise((r) => setTimeout(r, 100));

            dataList = await orm.all("testDataBase", "store3");

            await new Promise((r) => setTimeout(r, 100));

            for (let j = 0 ; j<10;j++){

                const n1 = Math.ceil(50*Math.random());
                const n2 = Math.ceil(99*Math.random());
                const n3 = n1 + Math.ceil(50*Math.random());
                const n4 = Math.ceil(99*Math.random());
                const n5 = Math.ceil(99*Math.random());
                const searchText = generateString(Math.ceil(4*Math.random()));


                const select1 = await orm.where("testDataBase", "store3",'index1','=',dataList[n1].key1).all();
                expect(select1.length === dataList.filter(it=>it.key1 === dataList[n1].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select2 = await orm.where("testDataBase", "store3",'index5','=',[dataList[n2].key3,dataList[n2].key4]).all();
                expect(select2.length === dataList.filter(it=>it.key3 === dataList[n2].key3 && it.key4 === dataList[n2].key4).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select3 = await orm.where("testDataBase", "store3",'index1','>',dataList[n3].key1).all();
                expect(select3.length === dataList.filter(it=>it.key1 > dataList[n3].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select4 = await orm.where("testDataBase", "store3",'index1','>=',dataList[n4].key1).all();
                expect(select4.length === dataList.filter(it=>it.key1 >= dataList[n4].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select5 = await orm.where("testDataBase", "store3",'index1','<',dataList[n5].key1).all();
                expect(select5.length === dataList.filter(it=>it.key1 < dataList[n5].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select6 = await orm.where("testDataBase", "store3",'index1','<=',dataList[n5].key1).all();
                expect(select6.length === dataList.filter(it=>it.key1 <= dataList[n5].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select7 = await orm.where("testDataBase", "store3",'index1','between', [ n1 , n3 ]).all();
                expect(select7.length === dataList.filter(it=>(it.key1 > n1 && it.key1 < n3)).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select8 = await orm.where("testDataBase", "store3",'index1','betweenInclude', [ n1 , n3 ]).all();
                expect(select8.length === dataList.filter(it=>(it.key1 >= n1 && it.key1 <= n3)).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select9 = await orm.where("testDataBase", "store3",'index6','like', searchText).all();
                let regex1 = new RegExp(`^(.*){0,}${searchText}(.*){0,}$`, 'i');
                expect(select9.length === dataList.filter(it=>(it.key6.match(regex1))).length).toBeTruthy();


                const select10 = await orm.where("testDataBase", "store3",'index6','%like%', searchText).all();
                let regex2 = new RegExp(`^(.*){0,}${searchText}(.*){0,}$`, 'i');
                expect(select10.length === dataList.filter(it=>(it.key6.match(regex2))).length).toBeTruthy();


                const select11 = await orm.where("testDataBase", "store3",'index6','%like', searchText).all();
                let regex3 = new RegExp(`^(.*){0,}${searchText}$`, 'i');
                expect(select11.length === dataList.filter(it=>(it.key6.match(regex3))).length).toBeTruthy();


                const select12 = await orm.where("testDataBase", "store3",'index6','like%', searchText).all();
                let regex4 = new RegExp(`^${searchText}(.*){0,}$`, 'i');
                expect(select12.length === dataList.filter(it=>(it.key6.match(regex4))).length).toBeTruthy();

                const select13 = await orm.where("testDataBase", "store3",'index6','match', `^${searchText}(.*){0,}$`).all();
                let regex5 = new RegExp(`^${searchText}(.*){0,}$`, 'i');
                expect(select13.length === dataList.filter(it=>(it.key6.match(regex5))).length).toBeTruthy();

                const select14 = await orm.where("testDataBase", "store3",'index6').all();
                expect(select14.length === 0).toBeTruthy();

                const select15 = await orm.where("testDataBase", "store3",'index1','>',dataList[n3].key1)
                    .where('index1','<=',dataList[n5].key1)
                    .where('index6','like',searchText).all();

                const pk13_3 = select3.map(it=>it.__pk);
                const pk13_6 = select6.map(it=>it.__pk);
                const pk13_9 = select9.map(it=>it.__pk);
                const pk13_result = pk13_3
                    .filter(it=>pk13_6.includes(it))
                    .filter(it=>pk13_9.includes(it));

                expect(pk13_result.length === select15.length).toBeTruthy();


                const select16 = await orm.where("testDataBase", "store3",'index1', '>', dataList[n3].key1)
                    .where('index1', '<=', dataList[n5].key1)
                    .where('index6', 'like', searchText)
                    .all('or');

                const pk14_3 = select3.map(it=>it.__pk);
                const pk14_6 = select6.map(it=>it.__pk);
                const pk14_9 = select9.map(it=>it.__pk);
                const pk14_result = [...new Set([...pk14_3,...pk14_6,...pk14_9])];

                expect(pk14_result.length === select16.length).toBeTruthy();


                await new Promise((r) => setTimeout(r, 100));
            }


        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    test('direct where : test by condition  = , > , >= , < , <= , like , multiWhere ', async () => {
        try {
            await orm.testDataBase.store3.clear();

            const maxCount = 100;
            let dataList = [];

            for (let i =0 ; i < maxCount ; i++){

                let data = {
                    key1: Math.ceil(100*Math.random()),
                    key2: Math.ceil(100*Math.random()),
                    key3: Math.ceil(100*Math.random()),
                    key4: Math.ceil(100*Math.random()),
                    key6: generateString(Math.ceil(15*Math.random())),
                };

                await orm.testDataBase.store3.insert( data);

                await new Promise((r) => setTimeout(r, 100));
            }

            await new Promise((r) => setTimeout(r, 100));

            dataList = await orm.testDataBase.store3.all();

            await new Promise((r) => setTimeout(r, 100));

            for (let j = 0 ; j<10;j++){

                const n1 = Math.ceil(50*Math.random());
                const n2 = Math.ceil(99*Math.random());
                const n3 = n1 + Math.ceil(50*Math.random());
                const n4 = Math.ceil(99*Math.random());
                const n5 = Math.ceil(99*Math.random());
                const searchText = generateString(Math.ceil(4*Math.random()));


                const select1 = await orm.testDataBase.store3.where('index1','=',dataList[n1].key1).all();
                expect(select1.length === dataList.filter(it=>it.key1 === dataList[n1].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select2 = await orm.testDataBase.store3.where('index5','=',[dataList[n2].key3,dataList[n2].key4]).all();
                expect(select2.length === dataList.filter(it=>it.key3 === dataList[n2].key3 && it.key4 === dataList[n2].key4).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select3 = await orm.testDataBase.store3.where('index1','>',dataList[n3].key1).all();
                expect(select3.length === dataList.filter(it=>it.key1 > dataList[n3].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select4 = await orm.testDataBase.store3.where('index1','>=',dataList[n4].key1).all();
                expect(select4.length === dataList.filter(it=>it.key1 >= dataList[n4].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select5 = await orm.testDataBase.store3.where('index1','<',dataList[n5].key1).all();
                expect(select5.length === dataList.filter(it=>it.key1 < dataList[n5].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select6 = await orm.testDataBase.store3.where('index1','<=',dataList[n5].key1).all();
                expect(select6.length === dataList.filter(it=>it.key1 <= dataList[n5].key1).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select7 = await orm.testDataBase.store3.where('index1','between', [ n1 , n3 ]).all();
                expect(select7.length === dataList.filter(it=>(it.key1 > n1 && it.key1 < n3)).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select8 = await orm.testDataBase.store3.where('index1','betweenInclude', [ n1 , n3 ]).all();
                expect(select8.length === dataList.filter(it=>(it.key1 >= n1 && it.key1 <= n3)).length).toBeTruthy();

                await new Promise((r) => setTimeout(r, 100));

                const select9 = await orm.testDataBase.store3.where('index6','like', searchText).all();
                let regex1 = new RegExp(`^(.*){0,}${searchText}(.*){0,}$`, 'i');
                expect(select9.length === dataList.filter(it=>(it.key6.match(regex1))).length).toBeTruthy();


                const select10 = await orm.testDataBase.store3.where('index6','%like%', searchText).all();
                let regex2 = new RegExp(`^(.*){0,}${searchText}(.*){0,}$`, 'i');
                expect(select10.length === dataList.filter(it=>(it.key6.match(regex2))).length).toBeTruthy();


                const select11 = await orm.testDataBase.store3.where('index6','%like', searchText).all();
                let regex3 = new RegExp(`^(.*){0,}${searchText}$`, 'i');
                expect(select11.length === dataList.filter(it=>(it.key6.match(regex3))).length).toBeTruthy();


                const select12 = await orm.testDataBase.store3.where('index6','like%', searchText).all();
                let regex4 = new RegExp(`^${searchText}(.*){0,}$`, 'i');
                expect(select12.length === dataList.filter(it=>(it.key6.match(regex4))).length).toBeTruthy();


                const select13 = await orm.testDataBase.store3
                    .where('index1', '>', dataList[n3].key1)
                    .where('index1', '<=', dataList[n5].key1)
                    .where('index6', 'like', searchText).all();

                const pk13_3 = select3.map(it=>it.__pk);
                const pk13_6 = select6.map(it=>it.__pk);
                const pk13_9 = select9.map(it=>it.__pk);
                const pk13_result = pk13_3
                    .filter(it=>pk13_6.includes(it))
                    .filter(it=>pk13_9.includes(it));

                expect(pk13_result.length === select13.length).toBeTruthy();


                const select14 = await orm.testDataBase.store3
                    .where('index1','>',dataList[n3].key1)
                    .where('index1','<=',dataList[n5].key1)
                    .where('index6','like',searchText).all('or');

                const pk14_3 = select3.map(it=>it.__pk);
                const pk14_6 = select6.map(it=>it.__pk);
                const pk14_9 = select9.map(it=>it.__pk);
                const pk14_result = [...new Set([...pk14_3,...pk14_6,...pk14_9])];

                expect(pk14_result.length === select14.length).toBeTruthy();


                await new Promise((r) => setTimeout(r, 100));
            }


        } catch (e) {
            expect(false).toBeTruthy();
        }
    });


    //--------------------------------------------------
    // event -------------------------------------------
    //--------------------------------------------------

    test('onInsert , onUpdate , onDelete', async () => {

        let insertCount = 0;
        let updateCount = 0;
        let deleteCount = 0;

        //---------------------------

        let insertEvent1 = orm.onInsert("testDataBase", "store2",function(){
            insertCount += 1;
        });

        let insertEvent2 = orm.onInsert("testDataBase", "store2",function(){
            insertCount += 1;
        });


        let updateEvent1 = orm.onUpdate("testDataBase", "store2",function(){
            updateCount += 1;
        });

        let updateEvent2 = orm.onUpdate("testDataBase", "store2",function(){
            updateCount += 1;
        });

        let deleteEvent1 = orm.onDelete("testDataBase", "store2",function(){
            deleteCount += 1;
        });

        let deleteEvent2 = orm.onDelete("testDataBase", "store2",function(){
            deleteCount += 1;
        });

        //--------------------------

        let resInsert1 = await orm.insert("testDataBase", "store2", {
            key1: "abc",
            key2: 0,
            key3: 100000,
            key4: "cde",
        });

        expect(insertCount === 2).toBeTruthy();

        let resUpdate1 = await orm.update("testDataBase", "store2", {
            ...resInsert1,
            key1: "abc777777777",
        });

        expect(updateCount === 2).toBeTruthy();

        let resDelete1 = await orm.delete("testDataBase", "store2",resInsert1.__pk);

        expect(deleteCount === 2).toBeTruthy();

        //---------------------------------------------

        orm.unbindInsert("testDataBase", "store2", insertEvent1);

        let resInsert2 = await orm.insert("testDataBase", "store2", {
            key1: "abc3",
            key2: 234,
            key3: 1000,
            key4: "cde2",
        });


        orm.unbindUpdate("testDataBase", "store2", updateEvent1);

        let resUpdate2 = await orm.update("testDataBase", "store2", {
            ...resInsert2,
            key1: "abc345",
        });


        orm.unbindDelete("testDataBase", "store2", deleteEvent1);


        let resDelete2 = await orm.delete("testDataBase", "store2", resInsert2.__pk);

        expect(insertCount === 3).toBeTruthy();
        expect(updateCount === 3).toBeTruthy();
        expect(deleteCount === 3).toBeTruthy();

        //---------------------------------------------

        orm.unbindAllInsert("testDataBase", "store2");
        orm.unbindAllUpdate("testDataBase", "store2");
        orm.unbindAllDelete("testDataBase", "store2");

        let resInsert3 = await orm.insert("testDataBase", "store2", {
            key1: "ab2c233",
            key2: 2334,
            key3: 10040,
            key4: "cde43242",
        });

        let resUpdate3 = await orm.update("testDataBase", "store2", {
            ...resInsert3,
            key1: "ab2c56",
        });

        let resDelete3 = await orm.delete("testDataBase", "store2", resInsert3.__pk);

        expect(insertCount === 3).toBeTruthy();
        expect(updateCount === 3).toBeTruthy();
        expect(deleteCount === 3).toBeTruthy();

    });

    test('direct onInsert , onUpdate , onDelete', async () => {

        let insertCount = 0;
        let updateCount = 0;
        let deleteCount = 0;

        //---------------------------

        let insertEvent1 = orm.testDataBase.store2.onInsert(function(){
            insertCount += 1;
        });

        let insertEvent2 = orm.testDataBase.store2.onInsert(function(){
            insertCount += 1;
        });


        let updateEvent1 = orm.testDataBase.store2.onUpdate(function(){
            updateCount += 1;
        });

        let updateEvent2 = orm.testDataBase.store2.onUpdate(function(){
            updateCount += 1;
        });

        let deleteEvent1 = orm.testDataBase.store2.onDelete(function(){
            deleteCount += 1;
        });

        let deleteEvent2 = orm.testDataBase.store2.onDelete(function(){
            deleteCount += 1;
        });

        //--------------------------

        let resInsert1 = await orm.insert("testDataBase", "store2", {
            key1: "abc",
            key2: 0,
            key3: 100000,
            key4: "cde",
        });

        expect(insertCount === 2).toBeTruthy();

        let resUpdate1 = await orm.update("testDataBase", "store2", {
            ...resInsert1,
            key1: "abc777777777",
        });

        expect(updateCount === 2).toBeTruthy();

        let resDelete1 = await orm.delete("testDataBase", "store2",resInsert1.__pk);

        expect(deleteCount === 2).toBeTruthy();

        //---------------------------------------------

        orm.testDataBase.store2.unbindInsert(insertEvent1)

        let resInsert2 = await orm.insert("testDataBase", "store2", {
            key1: "abc3",
            key2: 234,
            key3: 1000,
            key4: "cde2",
        });


        orm.testDataBase.store2.unbindUpdate(updateEvent1);

        let resUpdate2 = await orm.update("testDataBase", "store2", {
            ...resInsert2,
            key1: "abc345",
        });


        orm.testDataBase.store2.unbindDelete(deleteEvent1);


        let resDelete2 = await orm.delete("testDataBase", "store2", resInsert2.__pk);

        expect(insertCount === 3).toBeTruthy();
        expect(updateCount === 3).toBeTruthy();
        expect(deleteCount === 3).toBeTruthy();

        // //---------------------------------------------

        orm.testDataBase.store2.unbindAllInsert();
        orm.testDataBase.store2.unbindAllUpdate();
        orm.testDataBase.store2.unbindAllDelete();

        let resInsert3 = await orm.insert("testDataBase", "store2", {
            key1: "ab2c233",
            key2: 2334,
            key3: 10040,
            key4: "cde43242",
        });

        let resUpdate3 = await orm.update("testDataBase", "store2", {
            ...resInsert3,
            key1: "ab2c56",
        });

        let resDelete3 = await orm.delete("testDataBase", "store2", resInsert3.__pk);

        expect(insertCount === 3).toBeTruthy();
        expect(updateCount === 3).toBeTruthy();
        expect(deleteCount === 3).toBeTruthy();

    });




});


afterAll((done) => {
    done();
    process.exit('ERROR_CODE')
});
