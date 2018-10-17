// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';

// Create a new MongoClient
const client = new MongoClient(url, {useNewUrlParser: true});

// Use connect method to connect to the Server
client.connect((err) => {

  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // db.collection('Todos').find({_id: new ObjectId('5bc2248feaa2c21c3bed2e74')}).toArray().then((docs) => {
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch Todos', err);
  // });

  db.collection('Users').find({name: 'Nader'}).count().then((count) => {
    console.log(count);
  }, (err) => {
    console.log('Unable to count Todos', err);
  });

  client.close();
});