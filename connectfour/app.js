

var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");

var stats = require("./stats");
var port = process.argv[2];
var app = express();

app.use(function(req, res, next) {
	console.log('[LOG] %s\t%s\t%s\t%s',
		new Date().toISOString(), // timestamp
		req.connection.remoteAddress, // client's address
		req.method, // HTTP method
		req.url // requested URL
	);
	next(); // call on to next component
});

app.use(express.static(__dirname));

var server = http.createServer(app);
var col;
var turn = false;

app.post("/play/:column", function(req, res){
  col = req.params.column;
  turn = true;
  console.log(req.params.column);
});

app.get("/play/move", function(req, res){
  var info = {
    col: col,
    turn: turn
  }
  res.json(info);
  turn = false;
})

app.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./"});

});

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./"});
});


server.listen(port, function(){
  console.log("listening");
});
