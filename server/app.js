// 3rd party libraries
const express     = require('express'),
      bodyParser  = require('body-parser'),
      {ObjectId}  = require('mongodb');

// own libraries
const mongoose    = require('./database/mongoose'),
      User        = require('./models/User'),
      Todo        = require('./models/Todo');


// creating the app
const app = express();

// configure app middlewares
app.use(bodyParser.json());


// app routes
app.post('/todos', (req, res) => {
    
    let todo = new Todo({'text': req.body.text});

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(500).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    
    // get id
    let id = req.params.id;

    // check if the id is a valid one
    if (!ObjectId.isValid(id)) {
        res.status(400)
            .send({message: 'Invalid id'});
    }

    Todo.findById(id)
        .then((todo) => {

            // check if no todo exist
            if (!todo) {
                res.status(404)
                    .send({message: 'No todo is found'});
            }

            // 200 Ok
            res.status(200)
                .send({
                    message: 'todo retrieved successfully',
                    todo
                });
        })
        .catch(err => {
            res.status(400)
                .send();
        });
});




// determine the port
const port = process.env.port || 3000;

// bind the app to the port
app.listen(port, () => {
    console.log(`Application is up and running on port ${port}`);
});


module.exports = {app};




