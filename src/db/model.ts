import * as mongodb from 'mongodb';
const ObjectId = mongodb.ObjectID;

class Model {
    name: string;
    db: any;
    constructor(db, collectionName) {
        this.name = collectionName;
        this.db = db;
    }

    async insertOne(data) {
        const operation = await this.db.collection(this.name).insertOne(data);
        if (operation.result.ok !== 1 || operation.ops.length !== 1) {
            throw new Error('Db insertOne error');
        }
        return operation.ops[0];
    }

    async insert(data) {
        const operation = await this.db.collection(this.name).insert(data);
        if (operation.result.ok < 1 || operation.ops.length < 1) {
            throw new Error('Db insertOne error');
        }
        return operation.ops;
    }

    async find(qry?) {
        const query = qry || {};
        const result = await this.db.collection(this.name)
            .find(query).toArray();
        if (!result) {
            throw new Error('Db find error');
        }
        return result;
    }

    async findOneById(id) {
        let query = {
            _id: id
        }
        const result = await this.db.collection(this.name).findOne(query);
        // if (!result) {
        //     throw new Error('Db findOneById error');
        // }
        return result;
    }

    async findOneAndUpdate(id, data) {
        const query = { _id: id };
        const modifier = { $set: data };
        const options = { returnOriginal: false };
        const operation = await this.db
            .collection(this.name)
            .findOneAndUpdate(query, modifier, options);
        if (!operation.value) {
            throw new Error('Db findOneAndUpdate error');
        }
        return operation.value;
    }

    async update(id, data, incProp) {
        const query = { _id: id };
        const operation = await this.db
            .collection(this.name)
            .update(query, {
                $inc: { [incProp]: 1 },
                $push: { "jobs": data }
            })
        if (operation.result.ok !== 1) {
            throw new Error('Db updateAndPush error');
        }
        return operation.value;
    }

    async removeOne(id) {
        const query = { _id: ObjectId(id) };
        const operation = await this.db.collection(this.name).remove(query);
        if (operation.result.n !== 1) {
            throw new Error('Db remove error');
        }
        return { success: true };
    }

    async bulkUpdate(jobLookup) {
        let bulk = this.db.collection(this.name).initializeUnorderedBulkOp();
        let counter = 0;
        try {
            for (let key in jobLookup) {
                const query = { _id: jobLookup[key].id };
                counter++;
                bulk.find(query).upsert().update(
                    {
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
                    }
                );
                if (counter == 500) {
                    counter = 0;
                    await bulk.execute();
                    bulk = this.db.collection(this.name).initializeUnorderedBulkOp();
                }
            }
            if (counter > 0) {
                await bulk.execute();
            }
        }
        catch (e) {
            console.log("bulk operation error => ", e);
        }
        return;
    }
}

export default Model;