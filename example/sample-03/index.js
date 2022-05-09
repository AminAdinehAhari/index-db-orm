
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

            const maxCount = 100;

            for (let i =0 ; i < maxCount ; i++){

                let data = {
                    key1: Math.ceil(100*Math.random()),
                    key2: Math.ceil(100*Math.random()),
                    key3: Math.ceil(100*Math.random()),
                    key4: Math.ceil(100*Math.random()),
                    key6: generateString(Math.ceil(15*Math.random())),
                };

                await orm.insert("testDataBase", "storeTest", data);
            }



            for (let j = 0 ; j<10;j++){


                const searchText = generateString(Math.ceil(4*Math.random()));


                const select9 = await orm.where("testDataBase", "storeTest",'index6','like', searchText);
                let regex1 = new RegExp(`^(.*){0,}${searchText}(.*){0,}$`, 'i');
                console.log('===================================')
                console.log(searchText,select9)


            }







        }).catch(function (error) {
            console.log(error);
        });
});



