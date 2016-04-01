/**
 * Created by Eelco on 15-3-2016.
 */

const PORT = 3000;
const SCRIPT_PATH = './static_src/script/';
const SCRIPT_SERVER_PATH = SCRIPT_PATH+'server/';

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(PORT); console.log('Server online on port: '+PORT);
app.use(express.static(__dirname+'/static_src'));
app.get('/', function(request, response){
    response.sendFile(__dirname+"/index.html");
});

require(SCRIPT_PATH+"command.js")();
require(SCRIPT_SERVER_PATH+"user.js")(io);
require(SCRIPT_SERVER_PATH+"connection-server.js")(io);
require(SCRIPT_SERVER_PATH+"timer.js")(io);
require(SCRIPT_SERVER_PATH+"game.js")(io);

io.sockets.on('connection', function(socket){

    socket.on(Command.PENCIL_MOVE, function(data){
        socket.broadcast.emit(Command.PENCIL_UPDATE, data);
    });
    socket.on(Command.NEW_USER, function(Name_Input, callback){
        HandleConnecting(Name_Input, callback, socket);
    });

    socket.on("disconnect", function(){
        HandleDisconnecting(socket);
    });

    socket.on(Command.GET_USER, function(callback){
        callback(!socket.User ? null : socket.User);
    });

    socket.on(Command.SEND_MESSAGE, function(Message){
        io.sockets.emit(Command.NEW_MESSAGE, {User: socket.User, Msg:Message });
        StartTimer();
    });

    socket.on(Command.TOGGLE_READY, function(){
        socket.User.SetReady(socket.User.Ready ? false : true);
        CheckStatus();
        io.sockets.emit(Command.USER_LIST, GetUsers());
    });

});
