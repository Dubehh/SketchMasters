/**
 * Created by Rik on 22-3-2016.
 */

module.exports = function(io) {

    const Words = ["Apple", "Banana", "House", "Money", "Obama", "Sixpack", "Beer", "Snor"];
    const State = { WAITING: "Waiting", STARTED: "started"};

    var word;
    var drawingUser = null;
    var gameState = State.WAITING;

    this.GetDrawer = function(){ return drawingUser; };
    this.GetWord = function() { return word; };

    this.Start = function () {
        gameState = State.STARTED;
        word = RandomIndex(Words);
        drawingUser = RandomIndex(GetUsers());
        io.sockets.emit(Command.GAME_STARTED, { User: drawingUser, Word: word });
        StartTimer();
    };


    this.RandomIndex = function(array){
        return array[Math.floor(Math.random() * array.length)];
    };

    this.Finish = function(Winner_User){
        var Message = Winner_User.Name + " has won the game!";
        io.sockets.emit(Command.NEW_MESSAGE, {Msg:Message});
        // Wacht x seconden
        Stop();

    };

    this.Stop = function(){
        StopTimer();
        gameState = State.WAITING;
    };
    this.CheckStatus = function () {
        var users = GetUsers();
        for(i = 0; i < users.length ; i++ ) {
            var user = users[i];
            if(!user.Ready) return;
        }
        //Everyone ready
        Start();
    };
}

