interface transactionStoreRequestInterface {
    onsuccess : object
    onerror : object
}


interface transactionStoreInterface {
    clear() : transactionStoreRequestInterface
    add(data: object) : transactionStoreRequestInterface
    index(keyPath: string|number) : openCursorInterface
    get(keyPath: string|number) : transactionStoreRequestInterface
    put(data: object) : transactionStoreRequestInterface
    delete(keyPath: string|number) : transactionStoreRequestInterface
    getAll() : transactionStoreRequestInterface
    count(query: any) : transactionStoreRequestInterface
    openCursor() : transactionStoreRequestInterface
}

interface openCursorInterface {
    openCursor(keyRange: any) : transactionStoreRequestInterface
}


export interface transactionInterface {
    objectStore(name : string) : transactionStoreInterface
    onsuccess : object
    onerror : object
}
