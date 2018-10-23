// 3rd party libraries
const express     = require('express'),
      bodyParser  = require('body-parser'),
      {ObjectId}  = require('mongodb'),
      _           = require('lodash'),
      bcrypt      = require('bcryptjs');

// configure the project
const env = require('./config/config');

// own libraries
const mongoose      = require('./database/mongoose'),
      User          = require('./models/User'),
      Todo          = require('./models/Todo'),
      authenticate  = require('./middlewares/authenticate');

// creating the app
const app = express();

// configure app middlewares
app.use(bodyParser.json());


/*      app routes      */

// POST /todos
app.post('/todos', authenticate, (req, res) => {
    
    let todo = new Todo({
        'text': req.body.text,
        creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({creator: req.user._id})
    .populate('creator')
    .then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(500).send(err);
    });
});

// GET /todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
    
    // get id
    let id = req.params.id;

    // check if the id is a valid one
    if (!ObjectId.isValid(id)) {
        res.status(400)
            .send({message: 'Invalid id'});
    }

    Todo.findOne({
        _id: id,
        creator: req.user._id
    })
        .populate('creator')
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
app.delete('/todos/:id', authenticate, async (req, res) => {

    // get id
    let id = req.params.id;

    // check if the id is a valid id
    if (!ObjectId.isValid(id)) {
        res.status(400)
            .send({message: 'Invalid id'});
    }

    // delete the record

    try {
        const todo = await Todo.findOneAndDelete({_id: id, creator: req.user._id})
                                .populate('creator');

        // check if no todo found
        if (!todo) {
            res.status(404).send({message: 'No todo is found'});
        }

        // 200 Ok
        res.status(200).send({message: 'todo has been deleted successfully', todo});
        
    } catch (e) {
        res.status(400).send();
    }

});

// PATCH /todos/:id
app.patch('/todos/:id', authenticate, (req, res) => {

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

    Todo.findOneAndUpdate({
        _id: id,
        creator: req.user._id
    }, body, {new: true})
        .populate('creator')
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


// POST /users
app.post('/users', async (req, res) => {

    // get properties
    let body = _.pick(req.body, ['email', 'password']);

    // create user
    let user = new User(body);

    // save user
    try {
        await user.save();
        const token = await user.generateAuthToken(); // generate user token
        res.header('x-auth', token).status(200)
            .send({'message': 'User created successfully', user});

    } catch (e) {
        res.status(400).send({'message': 'Failed to create the user', error: e});
    }
    
})

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
    res.status(200)
        .send({user: req.user});
});

// POST /users/login
app.post('/users/login', async (req, res) => {

    // get user credentials
    let body = _.pick(req.body, ['email', 'password']);

    // get the user using credentials
    try {
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).status(200)
            .send({'message': 'Logged in successfully', user});
    } catch (e) {
        res.status(400).send({message: 'Invalid request', err});
    }

});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, async (req, res) => {

    try {
        await req.user.deleteToken(req.token);
        res.status(200).send({message: 'user logged out successfully'});
    } catch (e) {
        res.status(400).send();
    }
});


// determine the port
const port = process.env.PORT || 3000;

// bind the app to the port
app.listen(port, () => {
    console.log(`Application is up and running in ${env} mode on port ${port}`);
});


module.exports = {app};




