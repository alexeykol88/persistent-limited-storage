# TypeScript library starter

This is a small library to create a persistent limited storage for your project.

Use | import {Storage} from 'persistent-lim-storage' | to import a persistent limited storage.

Use | const *yourname* = new Storage(params); | to create an persistent limited storage. 

Use | const params = {
    limit: number,
    useLocalStorage: boolean,
    globalKey: string
} | to set the storage parameters.

Limit - amount of memory in bytes that you dont want to exceed, you can update limit later by setLimit(newlimit).
If you use local storage max limit you can set is 10mb.

useLocalStorage - true or false, do you want to use localStorage and sync it with your storage?

globalKey - special key for storage, library use this key to set data to localStorage.

Library functionality:
 
Storage.set(key: string, value: any) - set a node to your storage, and local storage.

Storage.remove(key: string) - delete node from local and your storage.

Storage.setLimit(limit: number) - to set a new limit for storage.

Storage.getDataFromLocalStorage() - get all data from local storage by the global key, init by default in constructor.

Storage.isFull() - is the storage full?

Storage.getFreeSpace() - return the count of bytes that availble in storage now.

Storage.get(key: string) - return the node value.

Storage.clearStorage() - delete all the key-value by globalKey in your and local storage.
