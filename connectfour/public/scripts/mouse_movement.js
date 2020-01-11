$(document).ready(function(){
    let showPointerInColumn = function(column){
        return function() {
            for (let i = 0; i < 7; i++) {
                $('#p' + i).attr('hidden', i != column);
            }
        };
    };

    for (let i = 0; i < 6; i++)
        for (let j = 0; j < 7; j++)
            $('#circle'+i+j).mouseenter(showPointerInColumn(j));
});