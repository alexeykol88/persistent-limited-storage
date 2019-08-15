//template for storage node
export class StorageNode {
    key: string;
    value: any;
    prev: StorageNode | null;
    next: StorageNode | null;
    
    constructor(key: string, value: any){
      this.key = key;
      this.value = value;
      this.prev = null;
      this.next = null;
    }
}