
var socket = new WebSocket("ws://localhost:3000");
var num;

socket.onmessage = function(event){
    console.log("im here");
    info = JSON.parse(event.data);
    if(info.type === "userCookieStuff") {num = info.value;}
    document.getElementById("cookie").innerHTML = num;
};

let playGame = function(){
    console.log("oof");
    let name = $("#name").val();
    console.log(name);
    $.get("/play/"+name);
};

$(document).ready(function(){
    $("#playButton").click(playGame);
});