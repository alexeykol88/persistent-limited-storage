"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.StorageNode = StorageNode;
//# sourceMappingURL=storageNode.js.map