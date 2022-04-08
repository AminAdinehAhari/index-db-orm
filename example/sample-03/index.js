const orm = new window.ormIndexDB.orm();
const dbBuilder = window.ormIndexDB.dbBuilder;
const storeBuilder = window.ormIndexDB.storeBuilder;
const indexBuilder = window.ormIndexDB.indexBuilder;

const dbPanel1 = new dbBuilder({name: 'database01', version: 1});
const storeUser = new storeBuilder({
    name: "users",
    indexesSchemas: [
        new indexBuilder({name: "email", keyPath: "email", option: {unique: true}}),
        new indexBuilder({name: "phoneNumber", keyPath: "phoneNumber", option: {unique: false}}),
        new indexBuilder({name: "userName", keyPath: "userName", option: {unique: false}})
    ]
});


const ormReady = async function () {
    const db = orm.db.database01;
    const userStore = db.store?.users;

    let res1 = null;
    let res2 = null;
    let e1 = null;
    let e2 = null;



    try {
        res1 = await userStore.insert({
            'email': `1email@gmail.com`,
            'phoneNumber': 100660,
            'userName': `userName`
        });
    }catch (e) {
        e1 = e;
    }


    try {
        res2 = await userStore.insert({
            'email': `1email@gmail.com`,
            'phoneNumber': 100661,
            'userName': `userName1`
        });
    }catch (e) {
        e2 = e;
    }


    console.log(res1);
    console.log(e1);
    console.log(res2);
    console.log(e2);


};


const init = function () {
    orm.addDb(dbPanel1.addStore(storeUser))
        .build(ormReady);
};


orm.removeAllDataBase().then((res) => {
    init();
});







