import {describe, expect} from "@jest/globals";
import {orm as ormClass} from "../src/index"
// const ormClass = require('../dist/ormIndexDB');



describe('orm class ', () => {

    test('check support in test mode', () => {
        try {
            const orm = new ormClass('test');
            expect(true).toBeTruthy();
        }catch (e) {
            expect(false).toBeTruthy();
        }
    });

    test('check support in product mode', () => {
        try {
            const orm = new ormClass();
            expect(false).toBeTruthy();
        }catch (e) {
            expect(true).toBeTruthy();
        }
    });



});
