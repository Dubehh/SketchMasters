/**
 * Created by Eelco on 15-3-2016.
 */


module.exports = function(io){

    /*
    * Word aangeroepen wanneer er een user connect met de server.
    * De username is de input die de gebruiker invoerd. De callback wordt doorgegeven zodat we
    * die kunnen terugsturen. De socket is de socket vanuit de app.js en de io komt ook uit de app.js
    * */
    this.HandleConnecting = function(Username, Callback, Socket){
        if(GetByName(Username) != null){
            Callback({ NewUser: false, User: null });
        }
        else{
            Socket.User = new User(Username);
            Callback({ NewUser: true, User: Socket.User});
        }
    };

    /*
    * Word aangeroepen wanneer er een user disconnect.
    * Er wordt een event getriggered wanneer deze user disconnect, met bijhorend event.
    * */
    this.HandleDisconnecting = function(Socket){
        if(!Socket.User) return;
        io.sockets.emit(Command.USER_DISCONNECTED, Socket.User);
        DeleteUser(Socket.User);
    };

}
