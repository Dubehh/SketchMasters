/**
 * Created by Eelco on 23-3-2016.
 */

$(function(){

    const readyButton = $("#readyButton"); /* ID van de div waarin de ready knop is */
    const notReadyButton = $("#notReadyButton"); /* ID van de div waarin de unready knop is */
    const chatContainer = $("#usersWrap");
    const userContainer = $("#chatWrap");

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
        Word = data.Word;
        if(Drawer == data.User){

        }else{

        }
        hideContainers();
    });

    function hideContainers(){
        userContainer.toggle("slide", { direction: 'right', mode: 'hide' }, function(){
            chatContainer.toggle("slide", { direction: 'right', mode: 'show' });
        });
    }
});