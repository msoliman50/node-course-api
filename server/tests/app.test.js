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
const numberOfTodos = 5; // number of todo's documents before any test

// users of todos
let ids = [ObjectId().toString(), ObjectId().toString()];

// the data of the authenticated user test
let token;
let authID;
let email = 'indeed@example.com'; 

// will run before any test case
beforeEach((done) => {
    User.deleteMany()
        .then(() => {
            // UsersSeeder.seed(4);
            res = UsersSeeder.seedOneWithToken(email);
            token = res.token;
            authID = res._id;
            UsersSeeder.seedWithOutToken(2);
            UsersSeeder.seedWithIds(2, ids);
            done();
        })
        .catch(e => done(e));

});
beforeEach((done) => {
    Todo.deleteMany()
        .then(() => {
            TodosSeeder.seed(3, ids[0]);
            TodosSeeder.seedWithId(id, authID);
            TodosSeeder.seed(1, authID);
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
                .set('x-auth', token)
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
                .set('x-auth', token)
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
                .set('x-auth', token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
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
                .set('x-auth', token)
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
                .set('x-auth', token)
                .expect(404)
                .expect({message: 'No todo is found'})
                .end(done);
        });

        // 400 Bad Request
        it('should not get any todo due to invalid id', (done) => {

            request(app)
                .get('/todos/123')
                .set('x-auth', token)
                .expect(400)
                .expect({message: 'Invalid id'})
                .end(done);
        });

    });
});


describe('Users', () => {

    // GET /users/me
    describe('GET /users/me', () => {

        // 200 Ok
        it('should return the authnticated user', (done) => {

            // get the authenticated user
            request(app)
                .get('/users/me')
                .set('x-auth', token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.user).toExist();
                    expect(res.body.user.email).toBe(email);
                })
                .end(done);
            
        });

        // 401 Authentication Required
        it('should return 401 authentication required', (done) => {

            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe('Authentication is required');
                })
                .end(done);
        });
    });

    // POST /users
    describe('POST /users', () => {

        // 200 Ok
        it('should create a user', (done) => {

            let email = 'validemail@exmaple.com';
            let password = '12345678';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body.user).toInclude({
                        email
                    });
                })
                .end(err => {
                    
                    if (err) {
                        return done(err);
                    }

                    User.findOne({email})
                        .then(user => {
                            expect(user).toExist();
                            expect(user.password).toNotBe(password); // due to hashing
                            done();
                        })
                        .catch(err => done(err));
                });
        });

        // 400 Bad Request
        it('should return 400 Bad request, due to invalid data', (done) => {
            
            request(app)
                .post('/users')
                .send({
                    email: '@abc',
                    password: '12'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('Failed to create the user');
                })
                .end(done);
        });

        // 400 Bad Request
        it('should return 400 if the email already exist', (done) => {
            request(app)
            .post('/users')
            .send({
                email,
                password: '12345678'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe('Failed to create the user');
            })
            .end(done);
        });
    });
});