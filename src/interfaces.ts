//module for Storage interface and configuration
declare module 'store' {
    export interface IStorage {
      set(key: string, value: any): void;
      get(key: string): any;
    }
  
    export class IStorageParams {
      limit: number;
      useLocalStorage: boolean;
      globalKey : string;
    }
  }