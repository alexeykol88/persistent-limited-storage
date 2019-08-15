  import {IStorage, IStorageParams} from 'store';
  import {StorageNode} from './storageNode';
  import 'sizeof';

  interface IStore {
    [key: string]: any;
  }

  export class Storage implements IStorage {
    private head : StorageNode | null;
    private tail: StorageNode | null;
    private store : IStore;
    private limit : number;
    private sizeof : any;
    private useLocalStorage: boolean;
    private globalKey : string;

  constructor(params: IStorageParams) {
    this.limit = params.limit;
    if (params.useLocalStorage && params.limit > 10 * 1024 * 1024) {
      this.limit = 10 * 1024 * 1024;
      console.warn("Max limit for local storage is 10mb, your storage limit set to 10mb.")
      }
    this.useLocalStorage = params.useLocalStorage;
    this.globalKey = params.globalKey;
    this.sizeof = require('sizeof').sizeof;
    this.store = {};
    this.head = null;
    this.tail = null;
    if (this.useLocalStorage) {
      this.getDataFromLocalStorage();
    }
  }

  public getFreeSpace() {
    return this.limit - this.sizeof(this.store);
  }

  public set(key: string, value: any): void {
      const node = new StorageNode(key, value);
      const size = this.sizeof(node);
      
      if (this.limit < size) {
      return;
      }

      if (this.store[node.key]) {
        this.store[node.key].value = value;
        this.remove(node.key);
      }
       
      while (this.getFreeSpace() < size) {
        if (this.tail !== null) {
          this.remove(this.tail.key);
        }
        else {
          return;
        }
      }

      this.setHead(node);

      if (this.useLocalStorage) {
        this.setToLocalStorage();
      }
  }
  
  private setToLocalStorage(): any {
    const storeToSave = Object.keys(this.store).map(key => 
      ({ key: key, value: this.store[key].value })).reduce(
        (f, s) => { f[s.key] = s; return f; }, {} as IStore)
        localStorage.setItem(this.globalKey, JSON.stringify(storeToSave))
  } 

  public get(key: string): any{

    if (!this.store[key]) {
      return null;
    }

    return this.store[key].value;
  }

  private getDataFromLocalStorage(): any {
     const fromLS = JSON.parse(localStorage.getItem(this.globalKey) || "{}");
     Object.keys(fromLS).forEach(key => {
      this.set(key, fromLS[key].value);
    });
  }

  public remove(key: string): any {
     const node = this.store[key];
     
     if(!node){
       return null;
     }
      
     let value = JSON.parse(JSON.stringify(node.value));

     if (node.prev !== null) {
       node.prev.next = node.next;
     }
     else {
       this.head = node.next;
     }

     if(node.next !==  null) {
       node.next.prev = node.prev;
     }
     else {
       this.tail = node.prev;
     }

     delete this.store[key];

     if (this.useLocalStorage) {
      this.setToLocalStorage();
   }

   return value;
  }

  public clearStorage() {
    this.store = {};
    this.head = null;
    this.tail = null;

    if (this.useLocalStorage) {
      this.setToLocalStorage();
    }
  }

  private setHead(node: StorageNode) {
    node.next = this.head;
    node.prev = null;

    if (this.head !== null) {
      this.head.prev = node;
    }
    this.head = node;

    if (this.tail === null) {
      this.tail = node;
    }
    this.store[node.key] = node;
  }
}
