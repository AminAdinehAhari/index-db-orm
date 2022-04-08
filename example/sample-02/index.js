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
    const userStore = db.store.users;

    for (let i = 0; i < 1000; i++) {
        try{
            await userStore.insert({
                'email': `1email${i}@gmail.com`,
                'phoneNumber': 100660 + i,
                'userName': `userName${i}`
            });
        }catch (e) {

        }

    }
};


const init = function () {
    orm.addDb(dbPanel1.addStore(storeUser))
        .build(ormReady);
};


orm.removeAllDataBase().then((res) => {
    init();
});







