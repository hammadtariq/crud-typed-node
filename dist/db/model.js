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
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectID;
class Model {
    constructor(db, collectionName) {
        this.name = collectionName;
        this.db = db;
    }
    insertOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield this.db.collection(this.name).insertOne(data);
            if (operation.result.ok !== 1 || operation.ops.length !== 1) {
                throw new Error('Db insertOne error');
            }
            return operation.ops[0];
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield this.db.collection(this.name).insert(data);
            if (operation.result.ok < 1 || operation.ops.length < 1) {
                throw new Error('Db insertOne error');
            }
            return operation.ops;
        });
    }
    find(qry) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = qry || {};
            const result = yield this.db.collection(this.name)
                .find(query).toArray();
            if (!result) {
                throw new Error('Db find error');
            }
            return result;
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                _id: id
            };
            const result = yield this.db.collection(this.name).findOne(query);
            // if (!result) {
            //     throw new Error('Db findOneById error');
            // }
            return result;
        });
    }
    findOneAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id: id };
            const modifier = { $set: data };
            const options = { returnOriginal: false };
            const operation = yield this.db
                .collection(this.name)
                .findOneAndUpdate(query, modifier, options);
            if (!operation.value) {
                throw new Error('Db findOneAndUpdate error');
            }
            return operation.value;
        });
    }
    update(id, data, incProp) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id: id };
            const operation = yield this.db
                .collection(this.name)
                .update(query, {
                $inc: { [incProp]: 1 },
                $push: { "jobs": data }
            });
            if (operation.result.ok !== 1) {
                throw new Error('Db updateAndPush error');
            }
            return operation.value;
        });
    }
    removeOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id: ObjectId(id) };
            const operation = yield this.db.collection(this.name).remove(query);
            if (operation.result.n !== 1) {
                throw new Error('Db remove error');
            }
            return { success: true };
        });
    }
    bulkUpdate(jobLookup) {
        return __awaiter(this, void 0, void 0, function* () {
            let bulk = this.db.collection(this.name).initializeUnorderedBulkOp();
            let counter = 0;
            try {
                for (let key in jobLookup) {
                    const query = { _id: jobLookup[key].id };
                    counter++;
                    bulk.find(query).upsert().update({
                        $currentDate: { lastModified: true },
                        $setOnInsert: {
                            userId: jobLookup[key].userId,
                            instituteId: jobLookup[key].institute,
                            projectId: jobLookup[key].projectId,
                            time: jobLookup[key].time
                        },
                        $inc: {
                            enqueue: jobLookup[key].enqueue,
                            complete: jobLookup[key].complete,
                            failed: jobLookup[key].failed,
                            work: jobLookup[key].work,
                            name: jobLookup[key].name,
                            analyze: jobLookup[key].analyze,
                        }
                    });
                    if (counter == 500) {
                        counter = 0;
                        yield bulk.execute();
                        bulk = this.db.collection(this.name).initializeUnorderedBulkOp();
                    }
                }
                if (counter > 0) {
                    yield bulk.execute();
                }
            }
            catch (e) {
                console.log("bulk operation error => ", e);
            }
            return;
        });
    }
}
exports.default = Model;
//# sourceMappingURL=model.js.map