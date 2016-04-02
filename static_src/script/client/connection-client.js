/**
 * Created by Eelco on 15-3-2016.
 */

$(document).ready(function(){

    const loginForm = $("#loginForm"); /* ID Van de Form*/
    const loginInput = $("#loginTextBar"); /* ID Van de text input box*/
    const loginError = $("#loginErrorDisplay"); /* ID van de div waarin een error kan worden gedisplayed */
    const userDisplay = $("#userList"); /* ID van de div waar de users gedisplayed worden. */
    const loginSubmit = $("#loginSub");
    const MAX_CHARS = 15;

    initializeDialog();
    /*
    * Wanneer de user een 'account' heeft aangemaakt wordt er een object aan hem gekoppeld.
    * Wanneer de user al bestaat dan wordt er een false callback gemaakt, anders een true.
    * De user wordt ook teruggegeven met de callback.
    * */
    loginForm.submit(function(e){
        e.preventDefault();
        socket.emit(Command.NEW_USER, loginInput.val(), function(callback){
            if(callback.NewUser){
                if(callback.User == null) return;
                loginForm.hide();
            }else{
                //Laat error zien dat naam al in gebruik is
            }
        });
        loginInput.val('');
    });


    /*
     *  Checked of de ingevoerde tekst 'leeg' is. Wanneer er slechts witteruimte wordt gebruikt
     *  dan returned de functie ook true.
     * */
    function isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }

    /*
    * Kijkt of de ingevoerde string karakters bevat die je niet wil hebben.
    * Op deze manier voorkom je ook XSS scripting.
    * */
    function hasInvalidCharacters(str){
        const banned = ["<",">","$","@","#","*","^",";"];
        for(i = 0; i < banned.length; i++)
            if(str.indexOf(banned[i]) != -1) return true;
        return false;
    }


    /*
    *  Wordt aangeroepen wanneer de user probeert in te loggen.
    *  Er wordt gekeken of de username al bestaat en of de invoer valide is.
    *  Als dat zo is dan mag de gebruiker joinen.
    * */
    loginSubmit.click(function(event) {
        event.preventDefault();
        var username = loginInput.val();
        if (isEmptyOrSpaces(username)) {
            displayError("Please fill in a Username.");
        } else if(hasInvalidCharacters(username)){
            displayError("Your username contains invalid characters.")
        } else if(username.length > MAX_CHARS){
            displayError("Your username length is limited to "+MAX_CHARS+" characters.");
        } else {
            socket.emit(Command.NEW_USER, loginInput.val(), function (callback) {
                if(!callback.NewUser){
                    displayError("This username is already used.");
                }else{
                    if(callback.User == null) return;
                    loginForm.dialog('close');
                }
            });
        }
        loginInput.val('');
    });

    function displayError(Error){

    }

    /*
    * Krijgt de lijst van alle users binnen wanneer deze wordt geupdate
    * */
    socket.on(Command.USER_LIST, function(result){
        userDisplay.html('');
        for(i = 0; i < result.length; i++){
           var user = result[i];
           var colour = user.Ready ? "style='background-color: rgba(26, 255, 0, 0.5);'" : "";
           var html = "<div id='user_"+user.ID+"' class='user' "+colour+"><span>"+user.Name+"</span></div>";
           userDisplay.append(html);
        }
    });

    /*
    * Word aangeroepen wanneer een user disconnect. Je kan hier eventueel een bericht mee versturen ofzo.
     **/
    socket.on(Command.USER_DISCONNECTED, function(User){

    });

    /*
     * Zet de configuratie van de dialog op
     * */
    function initializeDialog(){
        loginForm.dialog({
            modal: true,
            draggable: false,
            resizable: false,
            position: {
                my: "center",
                at: "center",
                of: window
            },
            show: 'blind',
            hide: 'blind',
            closeOnEscape: false,
            width: 330,
            dialogClass: 'ui-dialog-osx'
        });
    }
});