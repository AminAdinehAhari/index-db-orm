

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;



//------------------------------------------------------
// console.log(window.indexedDB);
// let request = window.indexedDB.open("MyTestDatabase", 3);
// request.onerror = event => {
//     console.log('Do something with request.errorCode!');
//     console.error("Database error: " + event.target.errorCode);
// };
// request.onsuccess = event => {
//     console.log('Do something with request.result!')
//     let db = event.target.result;
//     console.log(event);
//     console.log(db);
// };





const dbName = "the_name2";
const dbVersion = 2;

var request = indexedDB.open(dbName, 2);

const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

request.onerror = event => {
    console.log("error");
};

// init
request.onupgradeneeded = event => {
    console.log("onupgradeneeded");
    var db = event.target.result;

    var objectStore = db.createObjectStore("customers", { autoIncrement: true });
    objectStore.createIndex("name1", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });

    console.log(db);
    objectStore.transaction.oncomplete = event => {
        // Store values in the newly created objectStore.
        var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
        customerData.forEach(function(customer) {
            customerObjectStore.add(customer);
        });
    };

    objectStore.transaction.onerror = event => {
        // Don't forget to handle errors!
    };


    //--------------------------------------------------------
    //--------------------------------------------------------
    //--------------------------------------------------------
    var objectStore2 = db.createObjectStore("customers2", { autoIncrement: true });
    objectStore2.createIndex("name1", "name", { unique: false });
    objectStore2.createIndex("email", "email", { unique: true });
    objectStore2.transaction.oncomplete = event => {
        // Store values in the newly created objectStore.
        var customerObjectStore = db.transaction("customers2", "readwrite").objectStore("customers");
        customerData.forEach(function(customer) {
            customerObjectStore.add(customer);
        });
    };

    objectStore2.transaction.onerror = event => {
        // Don't forget to handle errors!
        console.log('error');
    };
};












