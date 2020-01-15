var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");
var player = require("./player");

var stats = require("./stats");
var port = process.argv[2];
var app = express();

var playerID = 0;
var game = new Game(1);

app.use(express.static(__dirname));

app.use(function(req, res, next) {
	console.log('[LOG] %s\t%s\t%s\t%s',
		new Date().toISOString(), // timestamp
		req.connection.remoteAddress, // client's address
		req.method, // HTTP method
		req.url // requested URL
	);
	next(); // call on to next component
});

var server = http.createServer(app);
var col;
var turn = false;
var currentPlayer = 0;

app.post("/play/:column/:nr", function(req, res){
  currentPlayer = req.params.nr;
  col = req.params.column;
  res.end();
  //console.log(req.params.column);
});

app.get("/play/move/:nr", function(req, res){
  if(req.params.nr == currentPlayer) {turn = false}
  else {turn = true}
  var info = {
    num: req.params.nr,
    col: col,
    turn: turn
  }
    console.log(info);
    res.json(info);

});

app.post("/play/moved", function(req, res){
  col = undefined;
  res.end();
});

app.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./"}); 
});

app.get("/play/getinfo", function(req, res){
  if(game["gamePlayers"] < 2){
    var playerX = new player(playerID++);
    game.addPlayer(playerX);
  }
  var info = {
    gameStart: (game["gamePlayers"] === 2),
    turn: playerX["turn"],
    nr: playerX["nr"]
  }
  //console.log(game);
  res.json(info);
});

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./"});
});



server.listen(port);
