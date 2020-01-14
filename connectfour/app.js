var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");

//var messages = require("./public/scripts/messages");
var stats = require("./stats");
var port = process.argv[2];
var app = express();

app.use(express.static(__dirname));

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {}; //property: websocket, value: game

setInterval(function(){
  for(let i in websockets){
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      if(gameObj.finalStatus != null){
        delete websockets[i];
      }
    }
  }
}, 5000);

let num = stats.gamesInitialised++;
console.log(Game.id);
var currentGame = new Game(num);
var connectionID = 0; //websocket stuff

wss.on("connection", function connection(ws){
  let con = ws;
  con.id = connectionID++;
  currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log("Player %s placed in game %s as %s",
  con.id,
  currentGame.id,
  );

})

app.post("/play/:column", function(req, res){
  console.log(req.params.column);

})

app.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./"});
});

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./"});
})


server.listen(port);
