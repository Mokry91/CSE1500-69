let showPointerInColumn = function(column){
    return function() {
        for (let i = 0; i < 7; i++) {
            $('#p' + i).attr('hidden', i != column);
        }
    };
};

var socket = new WebSocket("ws://localhost:3000");

let my_turn = false;
let emptyCircle = 'public/images/circle.png';
let redCircle = 'public/images/red.png';
let yellowCircle = 'public/images/yellow.png';

var waiting = true;

let playerNR = 0;
let oponentNR = 0;

let moveRow = function(row, column, color){
    return function(){
        if (color === 'red') {
            $('#circle' + row + column).attr('src', redCircle);
        }
        else
            $('#circle'+row+column).attr('src', yellowCircle);
        $('#circle'+(row+1)+column).attr('src', emptyCircle);
    }
};

let checkWin = function(row, column){
    return function() {
        //Horizontal
        curr = undefined;
        amount = 0;
        for (let i = -3; i < 4; i++){
            if ($('#circle'+row+(column+i)).attr('src') === curr) amount++;
            else {
                amount = 1;
                curr = $('#circle'+row+(column+i)).attr('src');
            }
            if (amount === 4) {
                console.log("WIN"  + $('#circle'+(row+i)+column).attr('src'));
                document.getElementById("gameinfo").innerHTML = $('#circle'+(row+i)+column).attr('src') + " won"; 
                return;
            }
        }
        //Vertical
        curr = undefined;
        amount = 0;
        for (let i = -3; i < 4; i++){
            if ($('#circle'+(row+i)+column).attr('src') === curr) amount++;
            else {
                amount = 1;
                curr = $('#circle'+(row+i)+column).attr('src');
            }
            if (amount === 4) {
                console.log("WIN" + $('#circle'+(row+i)+column).attr('src')); 
                document.getElementById("gameinfo").innerHTML = $('#circle'+(row+i)+column).attr('src') + " won"; 
                return;
            }
        }
        //Diagonal 1
        curr = undefined;
        amount = 0;
        for (let i = -3; i < 4; i++){
            if ($('#circle'+(row+i)+(column+i)).attr('src') === curr) amount++;
            else {
                amount = 1;
                curr = $('#circle'+(row+i)+(column+i)).attr('src');
            }
            if (amount === 4) {
                console.log("WIN"  + $('#circle'+(row+i)+column).attr('src')); 
                document.getElementById("gameinfo").innerHTML = $('#circle'+(row+i)+column).attr('src') + " won"; 
                return;
            }
        }
        //Diagonal 2
        curr = undefined;
        amount = 0;
        for (let i = -3; i < 4; i++){
            if ($('#circle'+(row+i)+(column-i)).attr('src') === curr) amount++;
            else {
                amount = 1;
                curr = $('#circle'+(row+i)+(column-i)).attr('src');
            }
            if (amount === 4) {
                console.log("WIN"  + $('#circle'+(row+i)+column).attr('src')); 
                document.getElementById("gameinfo").innerHTML = $('#circle'+(row+i)+column).attr('src') + " won"; 
                return;
            }
        }
    }
};


var insertInColumn = function(column, color){
    let row = 5;
    while ($('#circle'+row+column).attr('src') === emptyCircle){
        setTimeout(moveRow(row, column, color), (5-row)*200);
        row--;
    }
    
    setTimeout(checkWin(row+1, column), (6-row)*200+10);
    if (color === 'yellow')
        setTimeout(function(){my_turn = true;}, (6-row)*200+10);
};

let clickOnColumn = function(column){
    return function(){
        if ($('#circle5'+column).attr('src') !== emptyCircle) return;
        if (!my_turn) return;
        document.getElementById("gameinfo").innerHTML = "opponents turn";
        my_turn = false;
        waiting = true;
        socket.send(JSON.stringify({col:column, type:"column"}));
        insertInColumn(column, 'red');
    }
};

$(document).ready(function(){
    for (let i = 0; i < 6; i++)
        for (let j = 0; j < 7; j++)
            $('#circle' + i + j).mouseenter(showPointerInColumn(j)).click(clickOnColumn(j));
});
//this will go away lol
/*window.setInterval(updatePlay, 1000);

function updatePlay(){
    if(waiting){
        $.getJSON("/play/move/"+playerNR).done(function(info){
            console.log("col" + info["col"]);
            //my_turn = info["turn"];
            if(my_turn && info["col"] != undefined){
                insertInColumn(info.col, 'yellow');
                waiting=false;
                $.post("/play/moved");
            } 
        });
    }
};*/

socket.onmessage = function(event){
    info = JSON.parse(event.data);
    if(info.type == "gameBegin"){
        console.log(info["turn"]);
        my_turn = info["turn"];
        if(my_turn){
            document.getElementById("gameinfo").innerHTML = "your turn";
        }else{
            document.getElementById("gameinfo").innerHTML = "opponents turn";
        }
        waiting = !info["turn"];
        playerNR = info["nr"];
        oponentNR = info["oponent"];
    }
    if(info.type === "move"){
        insertInColumn(info.col, 'yellow');
        my_turn = true;
        document.getElementById("gameinfo").innerHTML = "your turn";
    }
};

