/**
 * Created by Rik on 18-3-2016.
 */

$(function(){

    const timerText = $("#time");
    socket.on(Command.TIME_UPDATED, function(TimeStamp){
        timerText.html(TimeStamp.Minute + ":" + TimeStamp.Second);
    });

});
