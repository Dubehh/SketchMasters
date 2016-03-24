/**
 * Created by Eelco on 15-3-2016.
 */

$(document).ready(function(){

    const loginForm = $("#test"); /* ID Van de Form*/
    const loginInput = $("#texttest"); /* ID Van de text input box*/
    const loginError = $(""); /* ID van de div waarin een error kan worden gedisplayed */
    const userDisplay = $("#userList"); /* ID van de div waar de users gedisplayed worden. */

    /*
    * Wanneer de user een 'account' heeft aangemaakt wordt er een object aan hem gekoppeld.
    * Wanneer de user al bestaat dan wordt er een false callback gemaakt, anders een true.
    * De user wordt ook teruggegeven met de callback.
    * */
    socket.emit(Command.NEW_USER, "Test User", function(callback){}); //TODO test user
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





});