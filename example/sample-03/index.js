const orm = new window.ormIndexDB.orm();


// helper function ----------------------
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

//--------------------------------------


orm.removeAllDataBase().then(function (res) {
    orm.addDB({
        name: "testDataBase",
        stores: [
            {
                name: "storeTest",
                indexes: [
                    {name: 'index1', keyPath: 'key1', option: {unique: false}},
                    {name: 'index2', keyPath: 'key2', option: {unique: false}},
                    {name: 'index3', keyPath: 'key3', option: {unique: false}},
                    {name: 'index4', keyPath: 'key4', option: {unique: false}},
                    {name: 'index6', keyPath: 'key6', option: {unique: false}},
                    {name: 'index5', keyPath: ['key3', 'key4'], option: {unique: false}},
                ]
            }
        ]
    })
        .onRebuildDB("testDataBase", function () {
            console.log("testDataBase rebuild )))))))))))))))))))))");
        })
        .build()
        .then(async function (res) {

            const maxCount = 42;

            for (let i = 0; i < maxCount; i++) {

                let data = {
                    key1: Math.ceil(100 * Math.random()),
                    key2: Math.ceil(100 * Math.random()),
                    key3: Math.ceil(100 * Math.random()),
                    key4: Math.ceil(100 * Math.random()),
                    key6: generateString(Math.ceil(15 * Math.random())),
                };

                await orm.insert("testDataBase", "storeTest", data);
            }

            console.log("complete insert");


            console.log("all");
            const d1 = Date.now();
            const all = await orm.all("testDataBase", "storeTest");

            console.log("pagination");
            const list1 = await orm.paginate("testDataBase", "storeTest",1,20);
            const list2 = await orm.paginate("testDataBase", "storeTest",2,20);
            const list3 = await orm.paginate("testDataBase", "storeTest",3,20);
            const list4 = await orm.paginate("testDataBase", "storeTest",4,20);
            const list5 = await orm.paginate("testDataBase", "storeTest",5,20);

            console.log(list1)
            console.log(list2)
            console.log(list3)
            console.log(list4)
            console.log(list5)


            const count = await orm.count("testDataBase", "storeTest");
            console.log(count)


            // for (let j = 0 ; j<10;j++){
            //     const d1 = Date.now();
            //     const searchText = generateString(Math.ceil(4*Math.random()));
            //     const all = await orm.where("testDataBase", "storeTest",'index6','like', searchText)
            //         .where('index1','<', 90).all();
            //     const d2 = Date.now();
            //     console.log(d2 - d1);
            //     console.log(all);
            //
            //     console.log("all -------------------------")
            //
            //     // let regex1 = new RegExp(`^(.*){0,}${searchText}(.*){0,}$`, 'i');
            //     // console.log('===================================');
            //     // console.log(searchText,select9)
            // }


        }).catch(function (error) {
        console.log(error);
    });
});



