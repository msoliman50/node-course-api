const {MongoClient, ObjectId} = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

const client = new MongoClient(url, {useNewUrlParser: true});

client.connect((err) => {

    const db = client.db(dbName);

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectId('5bba60f1424b4c212ccb9937')
        },
        {
            $min: {
                age: 10
            } 
        },
        {
            returnOriginal: false
        }
        ).then((result) => {
            console.log(result);
        }, (err) => {
            console.log(err);
        })

    client.close();
});