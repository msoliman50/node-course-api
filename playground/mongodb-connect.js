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

  db.collection('Todos').insertOne({
    text: 'Study Microservices',
    isCompleted: true
  }, (err, result) => {
    if (err) {
        return console.log('Unable to write to the Collection', err);
    }

    console.log(JSON.stringify(result, undefined, 2));
  });


  // db.collection('Users').insertOne({
  //   name: 'Ali',
  //   age: 26,
  //   location: '55 Ezbet el Naghl, Cairo, Egypt' 
  // }, (err, result) => {

  //   if (err) {
  //       console.log('Unable to Write to Users Collection', err);
  //   }

  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  client.close();
});