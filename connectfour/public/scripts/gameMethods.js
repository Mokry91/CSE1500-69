let showPointerInColumn=function(e){return function(){for(let n=0;n<7;n++)$("#p"+n).attr("hidden",n!=e)}};var socket=new WebSocket("wss://connect-four69.herokuapp.com/");let my_turn=!1,emptyCircle="public/images/circle.png",redCircle="public/images/red.png",yellowCircle="public/images/yellow.png";var waiting=!0;let playerNR=0,oponentNR=0,moveRow=function(e,n,t){return function(){"red"===t?$("#circle"+e+n).attr("src",redCircle):$("#circle"+e+n).attr("src",yellowCircle),$("#circle"+(e+1)+n).attr("src",emptyCircle)}},winner=function(e){return"public/images/red.png"==e?(my_turn=!1,socket.send(JSON.stringify({type:"gameended"})),document.getElementById("winSound").play(),"You Won!"):"public/images/yellow.png"==e?(socket.send(JSON.stringify({type:"gameended"})),my_turn=!1,document.getElementById("loseSound").play(),"You Lost :("):void 0},checkWin=function(e,n){return function(){curr=void 0,amount=0;for(let t=-3;t<4;t++)if(console.log($("#circle"+e+(n+t)).attr("src")),$("#circle"+e+(n+t)).attr("src")===curr?amount++:(amount=1,curr=$("#circle"+e+(n+t)).attr("src")),4===amount)return console.log("WIN"+$("#circle"+e+(n+t)).attr("src")),void(document.getElementById("gameinfo").innerHTML=winner($("#circle"+e+(n+t)).attr("src")));curr=void 0,amount=0;for(let t=-3;t<4;t++)if($("#circle"+(e+t)+n).attr("src")===curr?amount++:(amount=1,curr=$("#circle"+(e+t)+n).attr("src")),4===amount)return console.log("WIN"+$("#circle"+(e+t)+n).attr("src")),void(document.getElementById("gameinfo").innerHTML=winner($("#circle"+(e+t)+n).attr("src")));curr=void 0,amount=0;for(let t=-3;t<4;t++)if($("#circle"+(e+t)+(n+t)).attr("src")===curr?amount++:(amount=1,curr=$("#circle"+(e+t)+(n+t)).attr("src")),4===amount)return console.log("WIN"+$("#circle"+(e+t)+(n+t)).attr("src")),void(document.getElementById("gameinfo").innerHTML=winner($("#circle"+(e+t)+(n+t)).attr("src")));curr=void 0,amount=0;for(let t=-3;t<4;t++)if($("#circle"+(e+t)+(n-t)).attr("src")===curr?amount++:(amount=1,curr=$("#circle"+(e+t)+(n-t)).attr("src")),4===amount)return console.log("WIN"+$("#circle"+(e+t)+(n-t)).attr("src")),void(document.getElementById("gameinfo").innerHTML=winner($("#circle"+(e+t)+(n-t)).attr("src")))}};var insertInColumn=function(e,n){let t=5;for(;$("#circle"+t+e).attr("src")===emptyCircle;)setTimeout(moveRow(t,e,n),200*(5-t)),t--;setTimeout(checkWin(t+1,e),200*(6-t)+100)};let clickOnColumn=function(e){return function(){$("#circle5"+e).attr("src")===emptyCircle&&my_turn&&(document.getElementById("clickSound").play(),document.getElementById("gameinfo").innerHTML="Opponent's Turn",my_turn=!1,waiting=!0,socket.send(JSON.stringify({col:e,type:"column"})),insertInColumn(e,"red"))}};$(document).ready(function(){for(let e=0;e<6;e++)for(let n=0;n<7;n++)$("#circle"+e+n).mouseenter(showPointerInColumn(n)).click(clickOnColumn(n))}),socket.onmessage=function(e){info=JSON.parse(e.data),console.log("eskere "+info.type+" "+info.op),"begin"==info.type&&(console.log("this is "+info.op),document.getElementById("gameinfo").innerHTML="Opponent's Turn"),"gameover"==info.type&&(my_turn=!1,document.getElementById("gameinfo").innerHTML="Other Player Left"),"gameBegin"==info.type&&(console.log(info.op),my_turn=info.turn,document.getElementById("gameinfo").innerHTML=my_turn?"Your Turn":"Waiting for Opponent",waiting=!info.turn,playerNR=info.nr,oponentNR=info.oponent),"move"===info.type&&(insertInColumn(info.col,"yellow"),my_turn=!0,document.getElementById("gameinfo").innerHTML="Your Turn")};var makeFullScreen=function(){const e=document.documentElement;e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullScreen?e.webkitRequestFullScreen():e.msRequestFullscreen&&e.msRequestFullscreen()};