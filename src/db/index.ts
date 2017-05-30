import { MongoClient } from 'mongodb';
import Model from './model';
const config = require('../../config');
let DB;

class Db {
	ActiveJobs: Model;

	async connect() {
		if (!DB) {
			DB = await MongoClient.connect(config.db.url);
			this.ActiveJobs = new Model(DB, 'activeJobs');
		}
	}
};

const db = new Db();
export default db;