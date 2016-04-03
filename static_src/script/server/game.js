/**
 * Created by Rik on 22-3-2016.
 */

module.exports = function(io) {

    const Words = ["Apple", "Banana", "House", "Money", "Obama", "Sixpack", "Beer", "Bicycle"];
    const State = { WAITING: "Waiting", STARTED: "Started", ENDING: "Ending"};

    var drawingUser = null;
    var gameState = State.WAITING;

    this.GetDrawer = function(){ return drawingUser; };
    this.GetState = function() { return gameState; };

    this.Start = function () {
        gameState = State.STARTED;
        var word = RandomIndex(Words);
        drawingUser = RandomIndex(GetUsers());
        io.sockets.emit(Command.GAME_STARTED, { User: drawingUser, Word: word });
        var users = GetUsers();
        for(i = 0; i < users.length; i++) users[i].SetReady(false);
        StartTimer();
    };


    this.RandomIndex = function(array){
        return array[Math.floor(Math.random() * array.length)];
    };

    this.Finish = function(Winner){
        if(gameState == State.ENDING) return;
        var Message = Winner == null ? "Unfortunately no one guessed the word." : Winner.Name + " has guessed the word! Congrats!";
        NotifyPlayers(Message);
        setTimeout(function(){
            Stop();
        }, 5000);
    };

    this.Stop = function(){
        if(IsRunning()) StopTimer();
        gameState = State.WAITING;
        io.sockets.emit(Command.RESET_GAME);
    };

    this.CheckIngameJoin = function(Username){
        if(gameState == State.STARTED) NotifyPlayers(Username+" has joined the game!");
    };

    this.CheckIngameQuit = function(Username){
        if(gameState == State.STARTED) NotifyPlayers(Username+" has left the game!");
    };

    this.CheckStatus = function () {
        var users = GetUsers();
        if(gameState == State.STARTED){
            if(users.length < 2){
                NotifyPlayers("There are no more players left to play the game with.");
                setTimeout(function(){
                    Stop();
                }, 3000);
            }
        }else{
            if(users.length < 2) return;
            for(i = 0; i < users.length ; i++ ) {
                var user = users[i];
                if(!user.Ready) return;
            }
            Start();
        }
    };

    this.NotifyPlayers = function(Message){
        io.sockets.emit(Command.NEW_MESSAGE, {Msg:Message});
    };
}

