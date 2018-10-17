const Todo = require('./../../models/Todo');

let seed = (num) => {
    let todos = [];

    for(let i = 1; i <= num; i++){
        todos.push({
            text: `Todo test ${i}`
        });
    }

    Todo.insertMany(todos);
}

let seedWithId = (id) => {

    let todo = new Todo({
        _id: id,
        text: 'Test get'
    });

    todo.save();
}

module.exports = {
    seed,
    seedWithId
};