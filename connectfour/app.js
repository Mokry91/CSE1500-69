

var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");
var mouse = require("./public/scripts/mouse_events")

var stats = require("./stats");
var port = process.argv[2];
var app = express();

app.use(express.static(__dirname));

var server = http.createServer(app);

app.post("/play/:column/:row", function(req, res){
  Game.insertInColumn(parseInt(req.params.column), 'yellow');
  console.log(req.params.column + " " +req.params.row);
});

app.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./"});
});

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./"});
});


server.listen(port, function(){
  console.log("listening");
});
