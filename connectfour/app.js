var express = require("express");
const cookies = require("cookie-parser");
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

app.set("view engine", "ejs");
app.use(express.static(__dirname));
var maxUser = 0;
var users = [];

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

app.get("/play/:name", function(req, res){

  res.sendFile("game.html", {root: "./"});
  console.log(params.name);
});

app.get("/", function(req, res){
  if(cookies.signedCookie.userId === undefined){
    maxUser += 1;
    users[maxUser] = 1;
    res.cookie.userId = maxUser;
    cookies.signedCookie.userId = maxUser;
  }else{
    users[maxUser] += 1;
    res.cookie.userId = cookies.signedCookie.userId;
  }
  res.render("splash.ejs", {
    gamesInitialised: stats.gamesInitialised,
    gamesAborted: stats.gamesAborted,
    playersOnline: stats.playersOnline
  });
  //res.sendFile("splash.html", {root: "./"});
});

var websockets = [];
var game = new Game(stats.gamesInitialised++);

wss.on("connection", function connection(ws){
  if(game.state === "aborted"){
    game = new Game(stats.gamesInitialised++);
  }
  let con = ws;
  con.id = connectionID++;
  var playerX = new player(playerID++);
  stats.playersOnline += 1;
  playerX["con"] = con;
  game.addPlayer(playerX);
  oponent = playerX["oponent"];
  websockets[con.id] = game;

  con.send(JSON.stringify({type: "userCookieStuff", value: users[cookies.signedCookie.userId]}));


  con.on("close", function(code){
    console.log(con.id + " disconnected");
    stats.playersOnline -= 1;
    let game = websockets[con.id];
    if(game.state != "end" || game.state != "aborted"){
      if(game.playerA.con == con){
        if(game.playerB != null ) {game.playerB.con.send(JSON.stringify({type: "gameover"}))}
        game.state = "aborted";
        stats.gamesAborted += 1;
      }else{
        game.playerA.con.send(JSON.stringify({type: "gameover"}))
      }
    }
  });
  console.log(game.state+ " " + game.id);
  con.send(JSON.stringify({
    type: "gameBegin",
    gameStart: (game["gamePlayers"] === 2),
    turn: playerX["turn"],
    oponent: oponent,
    nr: playerX["nr"]
  }));
  console.log(game.state);
  if(game.isFull()){
    game.playerA.con.send(JSON.stringify({type:"begin"}));
    game = new Game(stats.gamesInitialised++);
  }

  ws.on("message", function incoming(message){
    let info = JSON.parse(message);
    let thisgame = websockets[con.id];
    if(info.type == "gameended"){
      thisgame.state = "end";
    }
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



// server.listen(3000);
server.listen(process.env.PORT || 3000);
