var game = function(gameID){
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    this.gameBoard = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
      ];
}

game.prototype.addPlayer = function(p) {  
    if (this.playerA == null) {
      this.playerA = p;
      return "A";
    } else {
      this.playerB = p;
      return "B";
    }
  };

  module.exports = game;