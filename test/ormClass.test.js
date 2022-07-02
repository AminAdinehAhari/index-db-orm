import {afterAll, describe, expect} from "@jest/globals";
import ormClass from "../src/index"
import textMessage from "../src/modules/helper/textMessage";
// const ormClass = require('../dist/indexDbOrm');



describe('orm class ', () => {

    test('check support in test mode', () => {
        try {
            const orm = new ormClass('test');
            expect(true).toBeTruthy();
            orm.allDbClose();
        }catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('check support in product mode', () => {
        try {
            const orm = new ormClass();
            expect(false).toBeTruthy();
            orm.allDbClose();
        }catch (e) {
            expect(true).toBeTruthy();
        }
    });

    test('not support',()=>{
        try {
            const orm = new ormClass();
            expect(false).toBeTruthy();
            orm.allDbClose();
        }catch (e) {
            expect(e.toString() === textMessage.ErrorBrowserSupport).toBeTruthy();
        }
    });




});


afterAll((done) => {
    done();
});
