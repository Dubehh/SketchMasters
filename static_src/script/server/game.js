/**
 * Created by Rik on 22-3-2016.
 */

module.exports = function(io) {

    const Words = ["Apple", "Banana", "House", "Money", "Obama", "Sixpack", "Beer", "Snor"];
    const State = { WAITING: "Waiting", STARTED: "started"};

    var word;
    var drawingUser = null;
    var gameState = State.WAITING;

    this.SetDrawer = function (User) {
        drawingUser = User;
        User.SetDrawing(true);
    };

    this.GetDrawer = function(){ return drawingUser; };


    this.Start = function () {
        gameState = State.STARTED;
        word = RandomIndex(Words);
        drawingUser = RandomIndex(GetUsers());
        io.sockets.emit(Command.GAME_STARTED, { User: drawingUser, Word: word });
        //TODO start timer
    };

    this.RandomIndex = function(array){
        return array[Math.floor(Math.random() * array.length)];
    };

    this.CheckStatus = function () {
        var users = GetUsers();
        for(i = 0; i < users.length ; i++ ) {
            var user = users[i];
            if(!user.Ready) return;
        }
        // iedereen is ready
        Start();
    };
}

