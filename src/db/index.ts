const config = require('../../config');
const Mongoose = require('mongoose');
let db;

class Db {

	async connect() {
		if (!db) {
			Mongoose.connect(config.db.url);
			db = await Mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error'));
			db.once('open', function callback() {
				console.log('database connected');
			});
		}
	}
};

export default new Db();