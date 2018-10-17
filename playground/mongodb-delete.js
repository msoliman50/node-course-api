const {MongoClient, ObjectId} = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

const client = new MongoClient(url, {useNewUrlParser: true});

client.connect((err) => {

    const db = client.db(dbName);

    db.collection('Users').findOneAndDelete({_id: new ObjectId('5bc2306b0ed9197201d831a6')}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete Todos', err);
    })

    client.close();
});