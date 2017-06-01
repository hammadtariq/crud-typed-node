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
const config = require('../../config');
const Mongoose = require('mongoose');
let db;
class Db {
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!db) {
                Mongoose.connect(config.db.url);
                db = yield Mongoose.connection;
                db.on('error', console.error.bind(console, 'connection error'));
                db.once('open', function callback() {
                    console.log('database connected');
                });
            }
        });
    }
}
;
exports.default = new Db();
//# sourceMappingURL=index.js.map