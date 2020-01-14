var express = require("express");
var http = require("http");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname));
var server = http.createServer(app);


server.listen(port);

app.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./"});
});

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./"});
})