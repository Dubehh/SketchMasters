/**
 * Created by Eelco on 15-3-2016.
 */

$(document).ready(function(){

    const chatBoxForm = $("#chatForm"); /* ID van de chat <form> */
    const chatBoxInput = $("#chatMessageBox"); /* ID van het tekstveld */
    const chatBoxArea = $("#chatContent"); /* ID van de chatbox*/
    const chatBoxError = $("#chatMessageError"); /* ID van de locatie van de error */

    var correctWord;
    var showingError = false;
    var messageID = 0;
    var canSendMessage = true;

    /*
    *  Wordt aangeroepen wanneer de gebruiker zijn bericht 'submit'.
    *  Wanneer de gebruiker zijn (valide) bericht verstuurd wordt deze naar alle
    *  sockets gestuurd en daar gedisplayed.
    * */
    chatBoxForm.submit(function(event){
        event.preventDefault();
        var message = chatBoxInput.val();
        socket.emit(Command.GET_USER, function(callback){
            if(callback == null){
                displayError('No user found, try rejoining.');
            } else if(isEmptyOrSpaces(message)) {
                displayError('Please insert a message.');
            } else if(isSpamming(message)){
                displayError('Please don\'t spam!');
            }else if(!canSendMessage) {
                displayError("You cannot chat while drawing!");
            }
            else{
                chatBoxError.hide();
                if(message.toLowerCase().indexOf(correctWord.toLowerCase()) != -1){
                    socket.emit(Command.PLAYER_WON, callback, function(finished){
                        if(finished) socket.emit(Command.SEND_MESSAGE, message);
                    });
                }else socket.emit(Command.SEND_MESSAGE, message);
            }
        });
        chatBoxInput.val('');
    });

    socket.on(Command.GAME_STARTED, function(data) {
        socket.emit(Command.GET_USER, function(callback){
            if(callback.ID == data.User.ID){
                canSendMessage = false;
            }
            correctWord = data.Word;
            appendMessage(null, "A new game has been started!");
        });
    });

    socket.on(Command.RESET_GAME, function(){
        canSendMessage = false;
        correctWord = null;
    });

    /*
    * Lees nieuwe chat berichten in die zijn gestuurd door alle users.
    * In de data wordt het bericht meegegeven en de sender.
    * */
    socket.on(Command.NEW_MESSAGE, function(data){
        var sender = data.User === undefined ? null : data.User.Name;
        var message = data.Msg;
        appendMessage(sender, message);
    });
    /*
     *  Checked of de ingevoerde tekst 'leeg' is. Wanneer er slechts witte ruimte wordt gebruikt
     *  dan returned de functie ook true.
     * */
    function isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }

    /*
    *  Voegt een bericht toe aan de chatbox.
    *  Hij scrollt ook automatisch mee zodat de gebruiker niet hoeft te scrollen.
    * */
    function appendMessage(Sender, Message){
        var msg = Sender == null ? "<b style='color: Yellow; text-shadow: 0 0 3px black;'>"+Message+"</b>" : "<b>"+Sender+"</b>: "+Message;
        chatBoxArea.append("<span id='message_"+messageID+"' class='message'>"+msg+"</span><br/>");
        chatBoxArea.animate({scrollTop: $("#message_"+messageID).offset().top }, 600);
        messageID++;
    }

    /*
    * Returned true wanneer de gebruiker 'spammed'.
    * */
    function isSpamming(Message){
        if(Message.length > 30 && Message.indexOf(" ") == -1) return true;
        return false;
    }

    /*
    * Laat een error bericht zien en zorgt dat deze ook weer verdwijnt na x tijd.
    * Omdat de gebruiker de submit button kan spammen heb ik een conditie toegevoegd voor wanneer
    * een errorbericht al zichtbaar is. Dit voorkomt dat er meerdere errors achter elkaar worden getoond.
    * */
    function displayError(ErrorMessage){
        if(showingError) return;
        chatBoxError.fadeIn(500);
        showingError = true;
        chatBoxError.html(ErrorMessage);
        chatBoxError.delay(2000).fadeOut(500, function(){
            chatBoxError.hide();
            showingError = false;
        });

    }
});