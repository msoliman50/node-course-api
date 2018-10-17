// 3rd party libraries
const express     = require('express'),
      bodyParser  = require('body-parser'),
      {ObjectId}  = require('mongodb'),
      _           = require('lodash');

// configure the project
require('./config/config');

// own libraries
const mongoose    = require('./database/mongoose'),
      User        = require('./models/User'),
      Todo        = require('./models/Todo');

// creating the app
const app = express();

// configure app middlewares
app.use(bodyParser.json());


/*      app routes      */

// POST /todos
app.post('/todos', (req, res) => {
    
    let todo = new Todo({'text': req.body.text});

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET /todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(500).send(err);
    });
});

// GET /todos/:id
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

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {

    // get id
    let id = req.params.id;

    // check if the id is a valid id
    if (!ObjectId.isValid(id)) {
        res.status(400)
            .send({message: 'Invalid id'});
    }

    // delete the record
    Todo.findByIdAndDelete(id)
        .then((todo) => {

            // check if no todo found
            if (!todo) {
                res.status(404)
                    .send({message: 'No todo is found'});
            }
            
            // 200 Ok
            res.status(200)
                .send({
                    message: 'todo has been deleted successfully',
                    todo
                });
        })
        .catch(err => {
            res.status(400)
                .send();
        });
});

// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {

    // get id
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'isCompleted']);

    // check if the id is valid
    if (!ObjectId.isValid(id)) {
        res.status(400)
            .send({message: 'Invalid id'});
    }

    // check parameters
    if  (_.isBoolean(body.isCompleted) && body.isCompleted) {
        body.completed_at = new Date().getTime();
    } else {
        body.completed_at = null;
        body.isCompleted = false;
    }

    Todo.findByIdAndUpdate(id, body, {new: true})
        .then((todo) => {
            
            // check if the todo exist
            if (!todo) {
                res.status(404)
                    .send({message: 'No todo is found'});
            }

            // 200 Ok
            res.status(200)
                .send({
                    message: 'todo has been updated successfully',
                    todo
                });
        })
        .catch(err => {
            res.status(400)
                .send();
        });

});


// determine the port
const port = process.env.PORT || 3000;

// bind the app to the port
app.listen(port, () => {
    console.log(`Application is up and running in ${env} mode on port ${port}`);
});


module.exports = {app};




