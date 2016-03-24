/**
 * Created by Eelco on 18-3-2016.
 */

$(function(){

    const drawCanvasID = "#drawCanvas";
    const canvas = document.getElementById(drawCanvasID.substring(1));
    const context = canvas.getContext('2d');

    socket.on(Command.PENCIL_UPDATE, function(data){
        var drawColor = data.Color;
        var drawSize = data.Size;
        draw(drawColor, drawSize, data.PrevX, data.PrevY, data.CurX, data.CurY);
    });

    function draw(Color, Size, XPrev, YPrev, XCur, YCur){
        context.beginPath();
        context.moveTo(XPrev, YPrev);
        context.lineTo(XCur, YCur);
        context.lineCap = "round";
        context.strokeStyle = Color;
        context.lineWidth = Size;
        context.stroke();
        context.closePath();
    }

});