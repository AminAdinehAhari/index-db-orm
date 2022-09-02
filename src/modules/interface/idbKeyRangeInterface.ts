export interface idbKeyRangeInterface {
   [key: string] : object|string|number
    only(value: string|number|string[]|number[]) : object
    lowerBound(lower: string|number|string[]|number[], open: boolean) : object
    upperBound(upper: string|number|string[]|number[], open: boolean) : object
    bound(lower: string|number|string[]|number[], upper: string|number|string[]|number[] , lowerOpen: boolean, upperOpen: boolean) : object
}
