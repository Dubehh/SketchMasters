/**
 * Created by Eelco on 15-3-2016.
 */

$(document).ready(function(){

    const loginForm = $("#loginForm"); /* ID Van de Form*/
    const loginInput = $("#loginTextBar"); /* ID Van de text input box*/
    const loginErrorContainer = $("#loginErrorContainer"); /* ID van de error box */
    const loginError = $("#loginErrorDisplay"); /* ID van de div waarin een error kan worden gedisplayed */
    const userDisplay = $("#userList"); /* ID van de div waar de users gedisplayed worden. */
    const loginSubmit = $("#loginSub");
    const formContent = $("#loginFormContent");
    const dialogDisplayName = "Choose a Username";
    const MAX_CHARS = 15; /* Maximale username lengte */
    const MIN_CHARS = 3;  /* Minimale username lengte */

    var errorShown = false;
    initializeDialog();

    $(window).resize(function(){
        if(loginForm.dialog('isOpen')){
            loginForm.dialog('destroy');
            initializeDialog();
        }
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
        const banned = ["<",">","$","@","#","*","^",";","_","-","%"];
        for(i = 0; i < banned.length; i++)
            if(str.indexOf(banned[i]) != -1) return true;
        return false;
    }


    /*
    *  Wordt aangeroepen wanneer de user probeert in te loggen.
    *  Er wordt gekeken of de username al bestaat en of de invoer valide is.
    *  Als dat zo is dan mag de gebruiker joinen.
    *  Wanneer de user een 'account' heeft aangemaakt wordt er een object aan hem gekoppeld.
    * */
    loginSubmit.click(function(event) {
        event.preventDefault();
        var username = loginInput.val();
        if (isEmptyOrSpaces(username)) {
            displayError("Please fill in a proper Username.");
        } else if(hasInvalidCharacters(username)){
            displayError("Your username contains invalid characters.")
        } else if(username.length > MAX_CHARS || username.length < MIN_CHARS) {
            displayError("Your username should be between "+MIN_CHARS+" and " + MAX_CHARS + " characters.");
        } else {
            loginErrorContainer.hide();
            errorShown = false;
            socket.emit(Command.NEW_USER, loginInput.val(), function (callback) {
                if(!callback.NewUser){
                    displayError("This username has already been used.");
                }else{
                    if(callback.User == null) return;
                    loginForm.dialog('close');
                }
            });
        }
        loginInput.val('');
    });

    function displayError(Error){
        if(errorShown){
            if(Error != loginError.html()) loginError.html(Error)
            return;
        }
        errorShown = true;
        loginError.html(Error);
        formContent.animate({ 'paddingTop' : "+=37px"}, 1000,
            function(){
                loginErrorContainer.show();
                $('#loginFormContent').animate({ 'paddingTop' : "-=37px"}, 0);
        });

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
        loginForm.attr('title', dialogDisplayName);
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
            width: 370,
            dialogClass: 'ui-dialog-osx'
        });
    }
});