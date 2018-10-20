// 3rd party libraries
const request       = require('supertest'),
      expect        = require('expect'),
      {ObjectId}    = require('mongodb');

// own files
const {app}         = require('../app'),
      Todo          = require('../models/Todo'),
      TodosSeeder   = require('../database/seeders/TodosSeeder'),
      User          = require('../models/User'),
      UsersSeeder   = require('../database/seeders/UsersSeeder');

// static properties for testing
let id = ObjectId().toString(); // new object id
const numberOfTodos = 4; // number of todo's documents before any test

// will run before any test case
beforeEach((done) => {
    User.deleteMany()
        .then(() => {
            UsersSeeder.seed(4);
            UsersSeeder.seedWithOutToken(2);
            done();
        })
        .catch(e => done(e));

});
beforeEach((done) => {
    Todo.deleteMany()
        .then(() => {
            TodosSeeder.seed(3);
            TodosSeeder.seedWithId(id);
            done();
        })
        .catch(e => done(e));
});

describe('Todos', () => {
    
    // POST /todos
    describe('POST /todos', () => {

        // 200 ok
        it('should create new todo', (done) => {

            let text = 'My Test 1';

            request(app)
                .post('/todos')
                .send({text})
                .expect(200)
                .expect((res) => {
                    expect(res.body.text)
                        .toBeA('string')
                        .toBe(text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    // stupid stuff
                    Todo.find({text})
                        .then((todos) => {
                            expect(todos.length).toBe(1);
                            expect(todos[0].text).toBe(text);
                            done();
                        }).catch((e) => done(e));

                });
        });

        // 400 Bad Request
        it('should not create new todo with invalid body data', (done) => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    
                    // stupid stuff
                    Todo.find()
                        .then((todos) => {
                            expect(todos.length).toBe(numberOfTodos);
                            done();
                        })
                        .catch((e) => done(e));
                });
        });
    });

    // GET /todos
    describe('GET /todos', () => {

        // 200 Ok
        it('should get all the todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(numberOfTodos);
                })
                .end(done);
        });

    });

    // GET /todos/:id
    describe('GET /todos/:id', () => {

        // 200 Ok
        it('should get the specified todo ', (done) => {

            request(app)
                .get(`/todos/${id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo).toInclude({_id: id});
                })
                .end(done);
        });

        // 404 Not Found
        it('should not get any todo', (done) => {
            
            let newId = ObjectId().toHexString();
            request(app)
                .get(`/todos/${newId}`)
                .expect(404)
                .expect({message: 'No todo is found'})
                .end(done);
        });

        // 400 Bad Request
        it('should not get any todo due to invalid id', (done) => {

            request(app)
                .get('/todos/123')
                .expect(400)
                .expect({message: 'Invalid id'})
                .end(done);
        });

    });
});