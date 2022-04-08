const orm = new window.ormIndexDB.orm();
const dbBuilder = window.ormIndexDB.dbBuilder;
const storeBuilder = window.ormIndexDB.storeBuilder;
const indexBuilder = window.ormIndexDB.indexBuilder;

const dbPanel1 = new dbBuilder({name: 'database01', version: 1});
const storeUser = new storeBuilder({
    name: "users",
    indexesSchemas: [
        // new indexBuilder({name: "email", keyPath: "email", option: {unique: true}}),
        // new indexBuilder({name: "phoneNumber", keyPath: "phoneNumber", option: {unique: false}}),
        // new indexBuilder({name: "userName", keyPath: "userName", option: {unique: false}})
    ]
});


const ormReady = async function () {
    const db = orm.db.database01;
    const userStore = db.store.users;

    let res1 = null;
    let res2 = null;
    let res3 = null;



    try {
        //---------------------------------
        // insert -------------------------
        //---------------------------------
        res1 = await userStore.insert({
            'email': `1email@gmail.com`,
            'phoneNumber': 100660,
            'userName': `userName`
        });
        // console.log(res1);

        //---------------------------------
        // select -------------------------
        //---------------------------------
        res2 = await userStore.get(res1.result);
        // console.log(res2);

        //---------------------------------
        // update -------------------------
        //---------------------------------
        res3 = await userStore.update({...res2.data, 'email': `tttttttt@gmail.com`});
        console.log(res3);




    }catch (e) {
        console.log(e);
    }


    // try{
    //     res3 = await userStore.get(1000);
    //     console.log(res3);
    // }catch (e) {
    //     console.log(e);
    // }







};


const init = function () {
    orm.addDb(dbPanel1.addStore(storeUser))
        .build(ormReady);
};


orm.removeAllDataBase().then((res) => {
    init();
});







