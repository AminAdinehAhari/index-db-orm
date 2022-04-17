const orm = new window.ormIndexDB.orm();


const testInsertMoreData = async ()=>{
    for (let i = 0; i < 1000; i++) {
        try {
            const res = await orm.insert("pandosLogs", "logError", {
                timestamp: Date.now(),
                mode: ['error', 'success', 'warning'][Math.floor(2.9 * Math.random())],
                value: Math.random(),
                amount : Math.random()
            });
            // console.log(res);
        } catch (e) {
            console.log(e);
        }
    }

    for (let i = 0; i < 1000; i++) {
        try {
            const res = await orm.insert("pandosLogs", "logHistory", {
                timestamp: Date.now(),
                mode: ['error', 'success', 'warning'][Math.floor(2.9 * Math.random())],
                value: Math.random(),
                amount : Math.random()
            });
            // console.log(res);
        } catch (e) {
            console.log(e);
        }

    }
};

const testFindData = async ()=>{

    try {
        const res = await orm.insert("pandosLogs", "logHistory", {
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res);

        const find1 = await orm.find("pandosLogs", "logHistory",res.__pk);

        console.log(find1);

        const find2 = await orm.find("pandosLogs", "logHistory",res.timestamp,'timestamp');

        console.log(find2);

        const find3 = await orm.find("pandosLogs", "logHistory",res.mode,'mode');

        console.log(find3);

        const find4 = await orm.find("pandosLogs", "logHistory",res.value,'value');

        console.log(find4);



    }catch (e) {
        console.log(e);
    }


};

const testPutData = async ()=>{
    try {
        const res_insert = await orm.insert("pandosLogs", "logHistory", {
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res_insert);

        const res_update = await orm.update("pandosLogs", "logHistory",{
            ...res_insert,
            mode: "test",
            value : 0.75
        });

        console.log(res_update);


    }catch (e) {

    }
};

const testDeleteData = async ()=>{
    try {
        const res_insert = await orm.insert("pandosLogs", "logHistory", {
            timestamp: 10000000000,
            mode: "amin",
            value: 0.25
        });

        console.log(res_insert);

        const res_delete = await orm.delete("pandosLogs", "logHistory",res_insert.__pk);

        console.log(res_delete);


    }catch (e) {

    }
};

const testGetAllData = async ()=>{
    try {
        const date1 = Date.now();
        console.log(date1)
        const res_all = await orm.all("pandosLogs", "logHistory");

        console.log((Date.now() - date1)/1000);

        console.log(res_all);



    }catch (e) {
        console.log(e);
    }
};


const testGetWhereCondition = async ()=>{
    try {

        await testInsertMoreData();

        console.log("insert complete ---------------------");

        const res_where_1 = await orm.where("pandosLogs", "logHistory",'mode','=','error');
        console.log(res_where_1);

        const res_where_2 = await orm.where("pandosLogs", "logHistory",'amount','between',[0.35,0.45]);
        console.log(res_where_2);

        const res_where_3 = await orm.where("pandosLogs", "logHistory",'amount','>',0.9);
        console.log(res_where_3);

        const res_where_4 = await orm.where("pandosLogs", "logHistory",'amount','<',0.2);
        console.log(res_where_4);

    }catch (e) {
        console.log(e);
    }
}


orm.removeAllDataBase().then((res) => {
    orm
        .addDB({
            name: "pandosLogs",
            stores: [
                {
                    name: "logError",
                    indexes: [
                        {name: 'timestamp', keyPath: 'timestamp', option: {unique: false}},
                        {name: 'mode', keyPath: 'mode', option: {unique: false}},
                    ]
                },
                {
                    name: "logHistory",
                    indexes: [
                        {name: 'timestamp', keyPath: 'timestamp', option: {unique: false}},
                        {name: 'mode', keyPath: 'mode', option: {unique: false}},
                        {name: 'amount', keyPath: 'amount', option: {unique: false}},
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
        .then(async (res) => {
            console.log("on ready");

            // await testInsertMoreData();
            //
            // await testFindData();

            // await testPutData();

            // await testDeleteData();

            // await testGetAllData();

            await testGetWhereCondition();

        })
        .catch((err) => {
            console.log("catch");
            console.error(err);
        });

}).catch((error) => {
    console.log(error);
});



