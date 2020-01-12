
let showPointerInColumn = function(column){
    return function() {
        for (let i = 0; i < 7; i++) {
            $('#p' + i).attr('hidden', i != column);
        }
    };
};

let my_turn = true;
let emptyCircle = 'public/images/circle.png';
let redCircle = 'public/images/red.png';
let yellowCircle = 'public/images/yellow.png';

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
            if (amount === 4) {console.log("WIN"); return;}
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
            if (amount === 4) {console.log("WIN"); return;}
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
            if (amount === 4) {console.log("WIN"); return;}
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
            if (amount === 4) {console.log("WIN"); return;}
        }
    }
};

let insertInColumn = function(column, color){
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
        my_turn = false;
        insertInColumn(column, 'red');
    }
};


$(document).ready(function(){
    for (let i = 0; i < 6; i++)
        for (let j = 0; j < 7; j++)
            $('#circle' + i + j).mouseenter(showPointerInColumn(j)).click(clickOnColumn(j));
});