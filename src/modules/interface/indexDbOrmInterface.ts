import {storeInterface} from "./storeInterface";

export interface whereCondition {
    index: string,
    operator: string,
    value: string|number|string[]|number[]
}


export interface whereObjectiveInterface {
    dbName: string
    storeName: string
    conditions: whereCondition[],
    orm: indexDbOrmInterface,
    where(cIndex: string, cOperator: string, cValues: string | number | string[] | number[]): whereObjectiveInterface
    all(operation: string): Promise<object[]>
}

export interface dataBaseHandlerInterface {
    insert(data: {[key: string] : string|number}): Promise<{[key: string] : string|number}>

    update(data: {[key: string] : string|number}): Promise<{[key: string] : string|number}>

    delete(_pk: string|number) : Promise<Boolean>

    find(value: string|number, searchPk: string) : Promise<{[key: string] : string|number}>

    all(): Promise<any[]>

    count(query : any): Promise<number>

    paginate(page : number , total : number ): Promise<object[]>

    where(conditionIndex: string, conditionOperator: string, conditionValues: string|number|string[]|number[]): whereObjectiveInterface

    clear(): Promise<indexDbOrmInterface>

    onInsert(event: object): string|number

    onUpdate(event: object): string|number

    onDelete(event: object): string|number

    unbindInsert(key: string|number): indexDbOrmInterface

    unbindUpdate(key: string|number): indexDbOrmInterface

    unbindDelete(key: string|number): indexDbOrmInterface

    unbindAllInsert(): indexDbOrmInterface

    unbindAllUpdate(): indexDbOrmInterface

    unbindAllDelete(): indexDbOrmInterface
}


export interface indexDbOrmInterface {
    IDB: object
    IDBTransaction: object
    IDBKeyRange: object
    __schema: object
    __mode: string

    [key: string]: any


    checkBrowserSupport(): void

}
