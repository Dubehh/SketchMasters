/**
 * Created by Eelco on 23-3-2016.
 */

$(function(){

    const readyButton = $("#readyButton"); /* ID van de div waarin de ready knop is */
    const notReadyButton = $("#notReadyButton"); /* ID van de div waarin de unready knop is */
    const chatContainer = $("#chatWrap");
    const userContainer = $("#usersWrap");
    const canvasTitle = $("#canvasTitleHeader");

    var Drawer = null;
    var Started = false;
    var Word;

    readyButton.click(function(event){
        socket.emit(Command.TOGGLE_READY);
        readyButton.hide();
        notReadyButton.show();
    });

    notReadyButton.click(function(event){
        socket.emit(Command.TOGGLE_READY);
        notReadyButton.hide();
        readyButton.show();
    });

    socket.on(Command.GAME_STARTED, function(data){
        Started = true;
        Drawer = data.User;
        Word = data.Word;
        var socketUser;
        socket.emit(Command.GET_USER, function(callback){ socketUser = callback; });
        if(socketUser == data.User){
            //Dit is voor degene die tekent
            setCanvasText("het woord is "+ Word);
        }else{
            //Ik ben niet aan het tekenen
            setCanvasText("Ik ben niet aan t tekenen");

        }
        hideContainers();

    });

    function setCanvasText(text){
        canvasTitle.children().html(text);
    }
    function hideContainers(){
        userContainer.toggle("slide", { direction: 'right', mode: 'hide' }, function(){
            chatContainer.toggle("slide", { direction: 'right', mode: 'show' });
        });
    }
});