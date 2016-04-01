/**
 * Created by Eelco on 15-3-2016.
 */


const Command = { NEW_USER: "new user" , /* Client */
    USER_DISCONNECTED: "user disconnected", /* Server */
    NEW_MESSAGE: "new message", /* Server */
    GET_USER: "get user", /* Client */
    SEND_MESSAGE: "send message", /* Client */
    USER_LIST: "all users" , /* Server */
    SELECTED_WORD: "selected word", /* Server */
    TIMER_START: "timer start", /* Server */
    GAME_STARTED: "game started", /* Server*/
    PENCIL_MOVE: "pencil move", /* Client */
    TIME_UPDATED: "time updated", /* Server */
    PENCIL_UPDATE: "pencil update", /* Server */
    TOGGLE_READY: "toggle ready"}; /* Client*/

if(typeof module !== 'undefined'){
    module.exports = function(){
        this.Command = Command;
    }
}


