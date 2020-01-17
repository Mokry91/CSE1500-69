var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");
var player = require("./player");

var stats = require("./stats");
var port = process.argv[2];
var app = express();

var playerID = 0;
var oponent = 0;
connectionID = 0;

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
const wss = new websocket.Server({ server });

var col;
var turn = false;
var currentPlayer = 0;

app.post("/play/:column/:nr", function(req, res){
  currentPlayer = req.params.nr;
  col = req.params.column;
  res.end();
});

app.get("/play/move/:nr", function(req, res){
  if(req.params.nr == currentPlayer) {turn = false}
  else {turn = true}
  var info = {
    num: req.params.nr,
    col: col,
    oponent: oponent,
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

/*
app.get("/play/getinfo", function(req, res){
  if(game["gamePlayers"] < 2){
    var playerX = new player(playerID++);
    game.addPlayer(playerX);
    oponent = playerX["oponent"];
  }
  var info = {
    gameStart: (game["gamePlayers"] === 2),
    turn: playerX["turn"],
    oponent: oponent,
    nr: playerX["nr"]
  }
  //console.log(game);
  res.json(info);
});*/

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./"});
});

var websockets = [];
var game = new Game(stats.gamesInitialised++);


wss.on("connection", function connection(ws){
  let con = ws;
  con.id = connectionID++;
  var playerX = new player(playerID++);
  stats.playersOnline += 1;
  playerX["con"] = con;
  game.addPlayer(playerX);
  oponent = playerX["oponent"];
  websockets[con.id] = game;

  con.on("close", function(code){
    console.log(con.id + " disconnected");
    let game = websockets[con.id];
    if(game.state != "end"){
      if(game.playerA.con == con){
        game.playerB.con.send(JSON.stringify({type: "gameover"}))
        stats.gamesAborted += 1;
      }else{
        game.playerA.con.send(JSON.stringify({type: "gameover"}))
      }
    }
  });

  con.send(JSON.stringify({
    type: "gameBegin",
    gameStart: (game["gamePlayers"] === 2),
    turn: playerX["turn"],
    oponent: oponent,
    nr: playerX["nr"]
  }));
  if(game.isFull()){
    game.playerA.con.send(JSON.stringify({type:"begin"}));
    game = new Game(stats.gamesInitialised++);
  }

  ws.on("message", function incoming(message){
    let info = JSON.parse(message);
    let thisgame = websockets[con.id];
    if(ws === thisgame.playerA.con){
      if(info.type == "column"){
        thisgame.playerB.con.send(JSON.stringify({type: "move", col: info.col}));
      }
    }else{
      if(info.type == "column"){
        thisgame.playerA.con.send(JSON.stringify({type: "move", col: info.col}));
      }
    }
  });
});



server.listen(port);
