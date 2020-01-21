
var socket = new WebSocket("ws://localhost:3000");
var num;

socket.onmessage = function(event){
    console.log("im here");
    info = JSON.parse(event.data);
    if(info.type === "userCookieStuff") {num = info.value;}
    document.getElementById("cookie").innerHTML = num;
};

let playGame = function(){
    let name = $("#name").val();
    $.get("/play/"+name);
};

let playSound = function(soundID){
    return function () {
        document.getElementById(soundID).play();
    }
}

$(document).ready(function(){
    $("#playButton").click(playGame);
    for(var i = 1; i < 11; i++){
        $("#tulogo"+i).click(playSound("gaySound"));
    }
    
});