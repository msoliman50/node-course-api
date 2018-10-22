const Todo = require('./../../models/Todo');

let seed = (num, creator) => {
    let todos = [];

    for(let i = 1; i <= num; i++){
        todos.push({
            text: `Todo test ${i}`,
            creator
        });
    }

    Todo.insertMany(todos);
}

let seedWithId = (id, creator) => {

    let todo = new Todo({
        _id: id,
        text: 'Test get',
        creator
    });

    todo.save();
}

module.exports = {
    seed,
    seedWithId
};