var game = function(gameID){
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gamePlayers = 0; //0 or 1 or 2
}

var num = 0;

game.prototype.addPlayer = function(p) {
    this.gamePlayers += 1;  
    if (this.playerA === null) {
        p["turn"] = true;
        p["nr"] = num++;
        p["oponent"] = num;
        this.playerA = p;
        return "A";
    } else {
         p["nr"] = num++;
         p["turn"] = false;
         p["oponent"] = this.playerA["nr"];
         this.playerB = p;
         return "B";
    }
  };

  game.prototype.isFull = function(){
      return this.gamePlayers == 2;
  }

  module.exports = game;