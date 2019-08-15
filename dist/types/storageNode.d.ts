export declare class StorageNode {
    key: string;
    value: any;
    prev: StorageNode | null;
    next: StorageNode | null;
    constructor(key: string, value: any);
}
