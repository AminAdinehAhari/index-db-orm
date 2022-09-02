import {indexInterface} from "./indexInterface";

export interface storeInterface {
    name: string
    keyPath: string
    keyPathAuto: boolean
    onInsert: any []
    onUpdate: any []
    onDelete: any []
    indexes: indexInterface []
}
