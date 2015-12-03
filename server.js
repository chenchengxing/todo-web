var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ObjectID = mongoose.Schema.Types.ObjectId;

mongoose.connect('mongodb://localhost/todo')

var Todos = mongoose.model('todos', new mongoose.Schema({ name: String, today: Boolean }));

// var History = mongoose.model('history', new mongoose.Schema({ name: String, origin: ['TODAY_LIST', 'WHOLE_LIST']}));



var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json

app.get('/list', function (req, res) {
  var todos = Todos.find(function (err, todos) {
    res.send(todos);
  })
});

app.post('/saveTodo', function (req, res) {
  var body = req.body;
  var val = req.body.value;
  if (val) {
    var newTodo = new Todos({
      // _id: new ObjectID(),
      name: val
    });
    newTodo.save(function (err, todo) {
      if (err) {
        console.log(err);
      } else {
        res.json(todo)
      }
    })
  }
});

app.post('/removeTodo', function (req, res) {
  var body = req.body;
  var id = body.id;
  if (id) {
    Todos.find({
      _id: id
    }).remove(function (err) {
      if (err) console.log(err)
      else {
        res.send(true)
      }
    })
  }
});

app.post('/markItToday', function (req, res) {
  var body = req.body;
  var id = body.id;
  if (id) {
    Todos.findById(id, function (err, todo) {
      todo.today = true;
      console.log('saving... ', todo)
      todo.save(function (err) {
        if (err) console.log(err)
        else {
          res.send(true)
        }
      })
    });
  }
});


app.post('/markDone', function (req, res) {
  var body = req.body;
  var id = body.id;
  // remove from todo and save to history
  if (id) {
    Todos.findById(id, function (err, todo) {
      todo.today = false;
      // var history = new History({
      //   name: todo.name,
      //   origin: 'TODAY_LIST'
      // });
      // history.save();
      todo.save(function(err, todo){
        if (err) console.log(err)
        else {
          res.send(true)
        }
      })
    });
  }
});

app.get('/', function (req, res) {
  res.sendFile('./index.html');
  // res.send('Hello World!');
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
