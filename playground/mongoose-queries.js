// 3rd party libraries
const {ObjectId} = require('mongodb');

// own files
const Todo = require('../server/models/Todo');


// the example document id
let id = '5bc662c524254c2b23f51130';

// recommended way of validating IDs
if (!ObjectId.isValid(id)) {
    return console.log('Id is not Valid !');
}

/*          find methods         */

// find
Todo.find({_id: id})
    .then((todos) => {
        console.log({todos});
    })
    .catch(err => console.log('Error occuered:', err));


// findOne
Todo.findOne({_id: id})
    .then((todo) => {
        console.log({todo});
    })
    .catch(err => console.log('Error occuered:', err));

// findById
Todo.findById(id)
    .then((todo) => {

        // handle if the todo is null
        if (!todo) {
            return console.log('Id doesn\'t exist');
        }
        console.log({todo})
    })
    .catch(err => console.log('Error occured:', err));

