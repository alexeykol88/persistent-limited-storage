(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.limitedstorage = {})));
}(this, (function (exports) { 'use strict';

    //template for storage node
    var StorageNode = /** @class */ (function () {
        function StorageNode(key, value) {
            this.key = key;
            this.value = value;
            this.prev = null;
            this.next = null;
        }
        return StorageNode;
    }());

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var sizeof_1 = createCommonjsModule(function (module, exports) {
    var sizeof = sizeof || {};
    sizeof.sizeof = function(object, pretty) {
        var objectList = [];
        var stack = [object];
        var bytes = 0;

        while (stack.length) {
            var value = stack.pop();

            if(typeof value === 'boolean'){
                bytes += 4;
            }else if(typeof value === 'string'){
                bytes += value.length * 2;
            }else if(typeof value === 'number'){
                bytes += 8;
            }else if(typeof value === 'object' && objectList.indexOf( value ) === -1){
                objectList.push(value);
                // if the object is not an array, add the sizes of the keys
                if (Object.prototype.toString.call(value) != '[object Array]'){
                    for(var key in value) bytes += 2 * key.length;
                }
                for(var key in value) stack.push(value[key]);
            }
        }
        return pretty ? sizeof.format(bytes) : bytes;
    };
    sizeof.format = function(bytes){
        if(bytes < 1024) return bytes + "B";
        else if(bytes < 1048576) return (bytes / 1024).toFixed(3) + "K";
        else if(bytes < 1073741824) return (bytes / 1048576).toFixed(3) + "M";
        else return (bytes / 1073741824).toFixed(3) + "G";
    };
    exports = module.exports = sizeof;
    });

    var C__Users_alexey_limitedStorage_node_modules_sizeof = createCommonjsModule(function (module, exports) {
    exports = module.exports = sizeof_1;
    });

    var Storage = /** @class */ (function () {
        function Storage(params) {
            this.limit = params.limit;
            if (params.useLocalStorage && params.limit > 10 * 1024 * 1024) {
                this.limit = 10 * 1024 * 1024;
                console.warn("Max limit for local storage is 10mb, your storage limit set to 10mb.");
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
        Storage.prototype.getFreeSpace = function () {
            return this.limit - this.sizeof(this.store);
        };
        Storage.prototype.set = function (key, value) {
            var node = new StorageNode(key, value);
            var size = this.sizeof(node);
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
        };
        Storage.prototype.setToLocalStorage = function () {
            var _this = this;
            var storeToSave = Object.keys(this.store).map(function (key) {
                return ({ key: key, value: _this.store[key].value });
            }).reduce(function (f, s) { f[s.key] = s; return f; }, {});
            localStorage.setItem(this.globalKey, JSON.stringify(storeToSave));
        };
        Storage.prototype.get = function (key) {
            if (!this.store[key]) {
                return null;
            }
            return this.store[key].value;
        };
        Storage.prototype.getDataFromLocalStorage = function () {
            var _this = this;
            var fromLS = JSON.parse(localStorage.getItem(this.globalKey) || "{}");
            Object.keys(fromLS).forEach(function (key) {
                _this.set(key, fromLS[key].value);
            });
        };
        Storage.prototype.remove = function (key) {
            var node = this.store[key];
            if (!node) {
                return null;
            }
            var value = JSON.parse(JSON.stringify(node.value));
            if (node.prev !== null) {
                node.prev.next = node.next;
            }
            else {
                this.head = node.next;
            }
            if (node.next !== null) {
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
        };
        Storage.prototype.clearStorage = function () {
            this.store = {};
            this.head = null;
            this.tail = null;
            if (this.useLocalStorage) {
                this.setToLocalStorage();
            }
        };
        Storage.prototype.setHead = function (node) {
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
        };
        return Storage;
    }());

    exports.Storage = Storage;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
