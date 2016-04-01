/**
 * Created by Rik on 22-3-2016.
 */

module.exports = function(io) {

    const State = {WAITING: "Waiting", STARTED: "started"};

    var drawingUser = null;
    var gameState = State.WAITING;

    this.SetDrawer = function (User) {
        drawingUser = User;
        User.SetDrawing(true);
    };

    this.GetDrawer = function () {
        return drawingUser;
    };

    this.Start = function () {
        gameState = State.STARTED;
        //TODO start timer
        //TODO select word
        //TODO broadcast message
    };

    this.CheckStatus = function () {
        var users = GetUsers();
        for(i = 0; i < users.length ; i++ )
        {
            console.log(users[i].Name);
        }
    };
}

