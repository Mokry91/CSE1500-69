var game = function(gameID){
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gamePlayers = 0; //0 or 1 or 2
}

game.prototype.addPlayer = function(p) {
    this.gamePlayers ++;  
    if (this.playerA == null) {
        p["turn"] = true;
        p["nr"] = 1;
         this.playerA = p;
         return "A";
    } else {
         p["nr"] = 2;
         this.playerB = p;
         return "B";
    }
    
  };

  module.exports = game;