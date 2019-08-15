import { IStorage, IStorageParams } from 'store';
import 'sizeof';
export declare class Storage implements IStorage {
    private head;
    private tail;
    private store;
    private limit;
    private sizeof;
    private useLocalStorage;
    private globalKey;
    constructor(params: IStorageParams);
    getFreeSpace(): number;
    set(key: string, value: any): void;
    private setToLocalStorage;
    get(key: string): any;
    private getDataFromLocalStorage;
    remove(key: string): any;
    clearStorage(): void;
    private setHead;
}
