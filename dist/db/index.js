"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const model_1 = require("./model");
const config = require('../../config');
let DB;
class Db {
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!DB) {
                DB = yield mongodb_1.MongoClient.connect(config.db.url);
                this.ActiveJobs = new model_1.default(DB, 'activeJobs');
            }
        });
    }
}
;
const db = new Db();
exports.default = db;
//# sourceMappingURL=index.js.map