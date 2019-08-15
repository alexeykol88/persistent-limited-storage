"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storageNode_1 = require("./storageNode");
require("sizeof");
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
        var node = new storageNode_1.StorageNode(key, value);
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
//# sourceMappingURL=limitedstorage.js.map