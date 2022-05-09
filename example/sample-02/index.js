const orm = new window.ormIndexDB.orm();

//--------------------------------------------------
// function ----------------------------------------
//--------------------------------------------------

const testInsertMoreData = async function () {
    for (let i = 0; i < 500; i++) {
        try {
            const res = await orm.insert("pandosLogs", "logError", {
                timestamp: Date.now(),
                mode: ['error', 'success', 'warning'][Math.floor(2.9 * Math.random())],
                value: Math.random(),
                amount: Math.random()
            });
            // console.log(res);
        } catch (e) {
            console.log(e);
        }

        try {
            const res = await orm.insert("pandosLogs", "logHistory", {
                timestamp: Date.now(),
                mode: ['error', 'success', 'warning'][Math.floor(2.9 * Math.random())],
                value: Math.random(),
                amount: Math.random(),
                mail: `${['mail', 'email', 'e-mail'][Math.floor(2.9 * Math.random())]}${Math.floor(10000 * Math.random())}@${['gmail', 'yahoo', 'webmail'][Math.floor(2.9 * Math.random())]}.${['ir', 'co', 'com'][Math.floor(2.9 * Math.random())]}`
            });
            // console.log(res);
        } catch (e) {
            console.log(e);
        }
    }
};

const testFindData = async function () {

    try {
        const res = await orm.insert("pandosLogs", "logHistory", {
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res);

        const find1 = await orm.find("pandosLogs", "logHistory", res.__pk);

        console.log(find1);

        const find2 = await orm.find("pandosLogs", "logHistory", res.timestamp, 'timestamp');

        console.log(find2);

        const find3 = await orm.find("pandosLogs", "logHistory", res.mode, 'mode');

        console.log(find3);

        const find4 = await orm.find("pandosLogs", "logHistory", res.value, 'value');

        console.log(find4);


    } catch (e) {
        console.log(e);
    }


};

const testPutData = async function () {
    try {
        const res_insert = await orm.insert("pandosLogs", "logHistory", {
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res_insert);

        const res_update = await orm.update("pandosLogs", "logHistory", {
            ...res_insert,
            mode: "test",
            value: 0.75
        });

        console.log(res_update);


    } catch (e) {

    }
};

const testDeleteData = async function () {
    try {
        const res_insert = await orm.insert("pandosLogs", "logHistory", {
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res_insert);

        const res_delete = await orm.delete("pandosLogs", "logHistory", res_insert.__pk);

        console.log(res_delete);


    } catch (e) {

    }
};

const testGetAllData = async function () {
    try {
        await testInsertMoreData();

        const date1 = Date.now();

        const res_all = await orm.all("pandosLogs", "logHistory");

    } catch (e) {
        console.log(e);
    }
};

const testGetWhereCondition = async function () {
    try {

        await testInsertMoreData();

        console.log("insert complete ---------------------");

        console.info("where = ");
        const res_where_1 = await orm.where("pandosLogs", "logHistory", 'mode', '=', 'error');
        console.log(res_where_1);

        console.info("where between ");
        const res_where_2 = await orm.where("pandosLogs", "logHistory", 'amount', 'between', [0.35, 0.45]);
        console.log(res_where_2);

        console.info("where > ");
        const res_where_3 = await orm.where("pandosLogs", "logHistory", 'amount', '>', 0.9);
        console.log(res_where_3);

        console.info("where < ");
        const res_where_4 = await orm.where("pandosLogs", "logHistory", 'amount', '<', 0.2);
        console.log(res_where_4);

        console.info("where like | %like% ");
        // const res_where_5 = await orm.where("pandosLogs", "logHistory",'mail','%like%',"49@gma");
        const res_where_5 = await orm.where("pandosLogs", "logHistory", 'mail', 'like', "49@gma");
        console.log(res_where_5);

        console.info("where like%");
        const res_where_6 = await orm.where("pandosLogs", "logHistory", 'mail', 'like%', "e-mail");
        console.log(res_where_6);

        console.info("where %like");
        const res_where_7 = await orm.where("pandosLogs", "logHistory", 'mail', '%like', "@gmail.co");
        console.log(res_where_7);

        console.info("where match");
        const res_where_8 = await orm.where("pandosLogs", "logHistory", 'mail', 'match', '^e\-mail1(.*)\.@gmail\.[a-zA-Z]{2}$');
        console.log(res_where_8);

    } catch (e) {
        console.log(e);
    }
};

const testGetMultiWhereCondition = async function () {
    try {

        await testInsertMoreData();

        console.log("insert complete ---------------------");

        const res_where_1 = await orm.multiWhere("pandosLogs", "logHistory", [
            {index: 'mode', operator: '=', value: 'error'},
            {index: 'amount', operator: 'between', value: [0, 0.75]},
            {index: 'amount', operator: '>', value: 0.2},
            {index: 'amount', operator: '<', value: 0.5}
        ], 'or');
        console.log(res_where_1);
        console.log([...new Set(res_where_1.map(it => it.__pk))]);

        const res_where_2 = await orm.multiWhere("pandosLogs", "logHistory", [
            {index: 'mode', operator: '=', value: 'error'},
            {index: 'amount', operator: 'between', value: [0, 0.75]},
            {index: 'amount', operator: '>', value: 0.2},
            {index: 'amount', operator: '<', value: 0.5}
        ], 'and');
        console.log(res_where_2);


    } catch (e) {
        console.log(e);
    }
};

const clearStore = async function () {
    try {
        await testInsertMoreData();

        console.log("insert data --------------");

        setTimeout(async function () {
            await orm.clearStore("pandosLogs", "logError");

            console.log("clear store --------------");
        }, 10000)


    } catch (e) {

    }
};


//--------------------------------------------------
// direct call -------------------------------------
//--------------------------------------------------

const testDirectCallInsertMoreData = async function () {
    for (let i = 0; i < 500; i++) {
        try {
            const res = await orm?.pandosLogs?.logError?.insert({
                timestamp: Date.now(),
                mode: ['error', 'success', 'warning'][Math.floor(2.9 * Math.random())],
                value: Math.random(),
                amount: Math.random()
            })

        } catch (e) {
            console.log(e);
        }

        try {
            const res = await orm?.pandosLogs?.logHistory?.insert({
                timestamp: Date.now(),
                mode: ['error', 'success', 'warning'][Math.floor(2.9 * Math.random())],
                value: Math.random(),
                amount: Math.random()
            })
            // console.log(res);
        } catch (e) {
            console.log(e);
        }

    }
};

const testDirectCallFindData = async function () {

    try {
        const res = await orm?.pandosLogs?.logHistory?.insert({
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res);

        const find1 = await orm?.pandosLogs?.logHistory?.find(res.__pk);

        console.log(find1);

        const find2 = await orm?.pandosLogs?.logHistory?.find(res.timestamp, 'timestamp');

        console.log(find2);

        const find3 = await orm?.pandosLogs?.logHistory?.find(res.mode, 'mode');

        console.log(find3);

        const find4 = await orm?.pandosLogs?.logHistory?.find(res.value, 'value');

        console.log(find4);


    } catch (e) {
        console.log(e);
    }


};

const testDirectCallPutData = async function () {
    try {
        const res_insert = await orm?.pandosLogs?.logHistory?.insert({
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res_insert);

        const res_update = await orm?.pandosLogs?.logHistory?.update({
            ...res_insert,
            mode: "test",
            value: 0.75
        });

        console.log(res_update);


    } catch (e) {

    }
};

const testDirectCallDeleteData = async function () {
    try {
        const res_insert = await orm?.pandosLogs?.logHistory?.insert({
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res_insert);

        const res_delete = await orm?.pandosLogs?.logHistory?.delete(res_insert.__pk);

        console.log(res_delete);


    } catch (e) {

    }
};

const testDirectCallGetAllData = async function () {
    try {

        await testDirectCallInsertMoreData();

        const date1 = Date.now();

        const res_all = await orm?.pandosLogs?.logHistory?.all();

        console.log(res_all);

    } catch (e) {
        console.log(e);
    }
};

const testDirectCallGetWhereCondition = async function () {
    try {

        await testDirectCallInsertMoreData();

        console.log("insert complete ---------------------");

        console.info("where = ");
        const res_where_1 = await orm?.pandosLogs?.logHistory?.where('mode', '=', 'error');
        console.log(res_where_1);

        console.info("where between ");
        const res_where_2 = await orm?.pandosLogs?.logHistory?.where('amount', 'between', [0.35, 0.45]);
        console.log(res_where_2);

        console.info("where > ");
        const res_where_3 = await orm?.pandosLogs?.logHistory?.where('amount', '>', 0.9);
        console.log(res_where_3);

        console.info("where < ");
        const res_where_4 = await orm?.pandosLogs?.logHistory?.where('amount', '<', 0.2);
        console.log(res_where_4);

        console.info("where like | %like% ");
        // const res_where_5 = await orm?.pandosLogs?.logHistory?.where('mail','%like%',"49@gma");
        const res_where_5 = await orm?.pandosLogs?.logHistory?.where('mail', 'like', "49@gma");
        console.log(res_where_5);

        console.info("where like%");
        const res_where_6 = await orm?.pandosLogs?.logHistory?.where('mail', 'like%', "e-mail");
        console.log(res_where_6);

        console.info("where %like");
        const res_where_7 = await orm?.pandosLogs?.logHistory?.where('mail', '%like', "@gmail.co");
        console.log(res_where_7);

        console.info("where match");
        const res_where_8 = await orm?.pandosLogs?.logHistory?.where('mail', 'match', '^e\-mail1(.*)\.@gmail\.[a-zA-Z]{2}$');
        console.log(res_where_8);


    } catch (e) {
        console.log(e);
    }
};

const directCallClearStore = async function () {
    try {
        await testDirectCallInsertMoreData();

        console.log("insert data --------------");

        setTimeout(async function () {
            await orm?.pandosLogs?.logError?.clear();

            console.log("clear store --------------");
        }, 10000)


    } catch (e) {
        console.log(e);
    }
};


orm.removeAllDataBase().then(function (res) {
    orm
        .addDB({
            name: "pandosLogs",
            stores: [
                {
                    name: "logError",
                    indexes: [
                        {name: 'timestamp', keyPath: 'timestamp', option: {unique: false}},
                        {name: 'mode', keyPath: 'mode', option: {unique: false}},
                        {name: 'multiIndex', keyPath: ['mode', 'timestamp'], option: {unique: false}},
                    ]
                },
                {
                    name: "logHistory",
                    indexes: [
                        {name: 'timestamp', keyPath: 'timestamp', option: {unique: false}},
                        {name: 'mode', keyPath: 'mode', option: {unique: false}},
                        {name: 'amount', keyPath: 'amount', option: {unique: false}},
                        {name: 'mail', keyPath: 'mail', option: {unique: false}},
                    ]
                },
            ]
        })
        .onRebuildDB("pandosLogs", function () {
            console.log("pandosLogs rebuild )))))))))))))))))))))");
        })
        .addDB({
            name: "pandousChats",
            stores: [
                {name: "message", indexes: []},
                {name: "users", keyPath: "userId", indexes: []},
            ]
        })
        .onRebuildDB("pandousChats", function () {
            console.log("pandousChats rebuild (((((((((((((((((((((");
        })
        .build()
        .then(async function (res) {
            console.log("on ready");

            // await testInsertMoreData();

            // await testFindData();

            // await testPutData();

            // await testDeleteData();

            // await testGetAllData();

            // await testGetWhereCondition();

            // await testGetMultiWhereCondition();

            // await clearStore();


            //--------------------------
            //--------------------------
            //--------------------------


            // await testDirectCallInsertMoreData();

            // await testDirectCallFindData();

            // await testDirectCallPutData();

            // await testDirectCallDeleteData();

            // await testDirectCallGetAllData();

            // await testDirectCallGetAllData();

            // await testDirectCallGetWhereCondition();

            // await directCallClearStore();


            //--------------------------
            //--------------------------
            //--------------------------


            // try {
            //     const res = await orm.insert("pandousChats", "users", {
            //         userId: 2342,
            //         text: "345345345"
            //     });
            //     console.log(res);
            //
            //     const res2 = await orm.update("pandousChats", "users", {
            //         ...res,
            //         userId: 23452,
            //         text: "34534000005345"
            //     });
            //
            //     console.log(res2);
            //
            // } catch (e) {
            //     console.log(e);
            // }
            //
            //
            // let dataBases = await orm.getAllDatabases();
            //
            //
            // console.log(dataBases);

        })
        .catch(function (err) {
            console.log("catch");
            console.error(err);
        });

}).catch(function (error) {
    console.log(error);
});



