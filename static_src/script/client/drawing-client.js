/**
 * Created by Eelco on 17-3-2016.
 */

$(function(){

    const canvasSize = $("#canvasSizeWrap");
    const drawCanvasID = "#drawCanvas";
    const canvas = document.getElementById(drawCanvasID.substring(1));
    const context = canvas.getContext('2d');

    var memoryCanvas = document.createElement('canvas');
    var memoryContext = memoryCanvas.getContext('2d');

    var drawColor = "black";
    var drawSize = 5;
    var drawing = false;
    var canDraw = false;

    var prevX, prevY, curX, curY;

    updateCanvasSize();
    $(drawCanvasID).mousedown(function(event){
        drawing = true;
        updateMouse(event);
    });

    socket.on(Command.GAME_STARTED, function(data){
          socket.emit(Command.GET_USER, function(callback){
              if(callback.ID == data.User.ID){
                  canDraw = true;    // cursor aanpassen TODO

              }
          });
    });

    document.onmouseup = function(){ drawing = false; };
    $(drawCanvasID).mouseout(function(){ drawing = false; });

    /*
    * Word aangeroepen wanneer de muis beweegt binnen de canvas
    * */
    $(drawCanvasID).mousemove(function(event){
        if(canDraw && drawing){
            updateMouse(event);
            handleDrawing(prevX, prevY, curX, curY, drawColor, drawSize);
        }
    });

    /*
    *  Dit update de canvas naar de juiste grootte.
    *  Omdat de context wordt geleegd wanneer de canvas resized moeten we een tijdelijke
    *  buffer maken voor het getekende gedeelte.
    * */
    function updateCanvasSize(){
        memoryCanvas.width = canvas.width;
        memoryCanvas.height = canvas.height;
        memoryContext.drawImage(canvas, 0, 0);
        context.canvas.width = canvasSize.width();
        context.canvas.height = canvasSize.height();
        context.drawImage(memoryCanvas, 0, 0);
    }
    /*
    *  We resizen de canvas wanneer de gebruiker het scherm kleiner maakt.
    *  We kunnen niet met CSS de width/height doen omdat de canvas dat niet toelaat.
    * */
    $(window).resize(function(){ updateCanvasSize(); });

    /*
    *  Zet de vorige x+y naar de huidige x+y.
    *  Daarnaast zet hij de huidige x+y naar de nieuwe x+y.
    *  Dit is simpelweg het updaten van het pad die de muis afloopt.
    * */
    function updateMouse(mouseEvent){
        prevX = curX; prevY = curY;
        var mouseOffset = canvas.getBoundingClientRect();
        curX = mouseEvent.clientX - mouseOffset.left;
        curY = mouseEvent.clientY - mouseOffset.top;
    }

    /*
    * Regelt het tekenen client-side bij degene die tekent
    * */
    function handleDrawing(px, py, cx, cy, color, size){
        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(cx, cy);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = size;
        context.stroke();
        context.closePath();
        sendDrawUpdate();
    }

    /*
    *  Stuurt de data van het tekenen naar alle andere sockets.
    *  - Kleur
    *  - Grootte
    *  - Vorige X + Y coordinaat
    *  - Huidige X + Y coordinaat
    * */
    function sendDrawUpdate(){
        var data = {Color: drawColor, Size: drawSize,
            PrevX: prevX, PrevY: prevY, CurX: curX, CurY: curY};
        socket.emit(Command.PENCIL_MOVE, data);
    }

});

