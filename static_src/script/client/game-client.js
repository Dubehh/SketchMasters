/**
 * Created by Eelco on 23-3-2016.
 */

$(function(){

    const readyButton = $("#readyButton"); /* ID van de div waarin de ready knop is */
    const notReadyButton = $("#notReadyButton"); /* ID van de div waarin de unready knop is */

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
});