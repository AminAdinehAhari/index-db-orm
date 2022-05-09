import {afterEach, describe, expect, jest} from "@jest/globals";
import {orm as ormClass} from "../src/index";


const db_schema_1 = {
    name: "testDataBase",
    stores: [
        {
            name: "store1",
            keyPath: 'id',
            indexes: [
                {name: 'timestamp', keyPath: 'timestamp', option: {unique: false}},
                {name: 'mode', keyPath: 'mode', option: {unique: false}},
                {name: 'multiIndex', keyPath: ['mode', 'timestamp'], option: {unique: false}},
            ]
        }
    ]
};

const orm = new ormClass('test');


describe('database', () => {

    test('add database , and check onRebuildDB', async () => {
        try {
            let actionEvent = false;

            let resOrm = await orm.addDB(db_schema_1).onRebuildDB("testDataBase", function () {
                actionEvent = true;
            }).build();

            expect(
                actionEvent &&
                !!resOrm.__schema?.testDataBase?.db &&
                !!resOrm.__schema?.testDataBase?.stores?.store1 &&
                !!resOrm?.testDataBase &&
                !!resOrm?.testDataBase?.store1
            ).toBeTruthy();

        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test("check create table", async () => {
        try {
            let resGetTables = await orm.getDataBase("testDataBase");
            expect(!!resGetTables).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test("check delete table", async () => {
        try {
            let resRemoveTables = await orm.removeDataBase("testDataBase");

            expect(!(
                !!resRemoveTables.__schema?.testDataBase?.db ||
                !!resRemoveTables.__schema?.testDataBase?.stores?.store1 ||
                !!resRemoveTables?.testDataBase ||
                !!resRemoveTables?.testDataBase?.store1
            )).toBeTruthy();
        } catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test("check remove all database", async () => {
        try {
            let resOrm = await orm.addDB(db_schema_1).build();

            let resRemoveTables = await orm.removeAllDataBase();

            expect(!(
                !!resRemoveTables.__schema?.testDataBase?.db ||
                !!resRemoveTables.__schema?.testDataBase?.stores?.store1 ||
                !!resRemoveTables?.testDataBase ||
                !!resRemoveTables?.testDataBase?.store1
            )).toBeTruthy();

        } catch (e) {
            expect(false).toBeTruthy();
        }
    });




});
