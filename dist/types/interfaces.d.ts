declare module 'store' {
    interface IStorage {
        set(key: string, value: any): void;
        get(key: string): any;
    }
    class IStorageParams {
        limit: number;
        useLocalStorage: boolean;
        globalKey: string;
    }
}
