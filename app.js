'use strict';


const PORT = 12345;

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.get('/todos', function(req, res) {
  fs.readFile('./todos.json', function(err, data) {
    var todos = JSON.parse(data);
    res.send(todos);
  })
})

app.post('/todos', function(req, res) {
  fs.readFile('./todos.json', function(err, data) {

    var tasks = JSON.parse(data);
    tasks.push(req.body);

    fs.writeFile('./todos.json', JSON.stringify(tasks), function(err) {
      console.log('done');

      res.send();

    });
  });
});

app.post('/todos/:index', function(req, res) {

  fs.readFile('./todos.json', function(err, data) {

    var tasks = JSON.parse(data);
    tasks[req.body.index].isComplete = req.body.Complete;

    fs.writeFile('./todos.json', JSON.stringify(tasks), function(err) {
      console.log('wrote to file');

      res.send();
    });
  });
});

app.delete('/todos/:index', function(req, res) {

  fs.readFile('./todos.json', function(err, data) {
    var todos = JSON.parse(data);
    todos.splice(req.body.index, 1);

    fs.writeFile('./todos.json', JSON.stringify(todos), function(err) {
      console.log('successfuly deleted, son!');
      res.send();
    });
  });
});

var server = http.createServer(app);

server.listen(PORT, function() {
  console.log(`Servin' it up all day long at port ${PORT}`);
});
