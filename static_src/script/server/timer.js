/**
 * Created by Eelco on 1-4-2016.
 */

module.exports = function(io){

    const MAX_TIME = 60 + 30; // 1.5 minute
    var running = false;
    var timerInstance;

    /*
    *  Stopt de timer
    * */
    this.StopTimer = function(){
        clearInterval(timerInstance);
        running = false;
    };

    /**
     * Checked of de timer is aan
     */
    this.IsRunning = function(){ return running; };
    /*
    * Start de timer aan de serverkant, elke tick wordt doorgestuurd naar de clients.
    * De clients gebruiken deze tijd om het te updaten.
    * */
    this.StartTimer = function(){
        running = true;
        var timer = MAX_TIME, minutes, seconds;
        timerInstance = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            if (--timer < 0) {
                Finish(null);
                StopTimer(); return;
            }
            io.sockets.emit(Command.TIME_UPDATED, {Minute: minutes, Second: seconds});
        }, 1000);
    };


}
