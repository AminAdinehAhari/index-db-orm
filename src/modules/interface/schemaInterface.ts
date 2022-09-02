import {storeInterface} from "./storeInterface";

export interface schemaInterface {
    version: number,
    currentVersion: number,
    db: any,
    name: string,
    onRebuild: any,
    isBuild: boolean,
    stores: {
        [key: string] : storeInterface
    }
}


export interface schemaEnterInterface {
    version: number,
    currentVersion: number,
    db: any,
    name: string,
    onRebuild: any,
    isBuild: boolean,
    stores: storeInterface[]
}
