const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		'mongodb+srv://nicodias:6eHxpOrjEx2b5tTb@clusternico.i3gjibw.mongodb.net/Node-complete?retryWrites=true&w=majority'
	)
		.then((client) => {
			console.log('Connected!');
			_db = client.db();
			callback();
		})
		.catch((err) => {
			console.log('hubo error' + err);
			throw err;
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
