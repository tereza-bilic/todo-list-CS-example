const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

db.serialize(() => {
  // user table with id, username and password
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)')
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', 'admin'])
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['user', 'user'])
  // todo table with date, completed boolean, color and title
  db.run('CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN, color TEXT, date TEXT)')
  db.run('INSERT INTO todos (title, completed, color, date) VALUES (?, ?, ?, ?)', ['todo1', false, 'red', '2018-01-01'])
  db.run('INSERT INTO todos (title, completed, color, date) VALUES (?, ?, ?, ?)', ['todo2', true, 'blue', '2018-01-02'])
  db.run('INSERT INTO todos (title, completed, color, date) VALUES (?, ?, ?, ?)', ['todo3', false, 'green', '2018-01-03'])
})

var express = require('express');//then we call express
var app = express();//takes us to the root(/) URL
var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// allow cors in express
app.use(cors())
//get todos from database using date, color, name
app.get('/todos', function (req, res) {
  db.all('SELECT * FROM todos WHERE date = ? AND color = ? AND title = ?', [req.query.date, req.query.color, req.query.title], (err, rows) => {
    res.send(rows)
  })
})
// get todos by id
app.get('/todo/:id', function (req, res) {
  db.get('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, row) => {
    res.send(row)
  })
})

//get user from database by id
app.get('/user/:id', function (req, res) {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    res.send(row)
  })
})

//check if user exists in database from post request
app.post('/login', function (req, res) {
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [req.body.username, req.body.password], (err, row) => {
    res.send(row)
  })
})

// add user to database and check if two input passwords are the same
app.post('/register', function (req, res) {
  if (req.body.password === req.body.confirmPassword) {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, req.body.password])
    res.send('user added')
  } else {
    res.send('passwords do not match')
  }
})

// add todo to database
app.post('/todo', function (req, res) {
  db.run('INSERT INTO todos (title, completed, color, date) VALUES (?, ?, ?, ?)', [req.body.title, req.body.completed, req.body.color, req.body.date])
  res.send('todo added')
})

// update todo in database
app.put('/todo/:id', function (req, res) {
  db.run('UPDATE todos SET title = ?, completed = ?, color = ?, date = ? WHERE id = ?', [req.body.title, req.body.completed, req.body.color, req.body.date, req.params.id])
  res.send('todo updated')
})

// delete todo from database
app.delete('/todo/:id', function (req, res) {
  db.run('DELETE FROM todos WHERE id = ?', [req.params.id])
  res.send('todo deleted')
})

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
