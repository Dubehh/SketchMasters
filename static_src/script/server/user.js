/**
 * Created by Eelco on 15-3-2016.
 */

module.exports = function(io){

    const Users = [];
    var IDCount = 0;

    /*
    * Returned de user aan de hand van een gegeven naam
    * Wanneer de naam niet voorkomt bij een user dan returned de functie 'null'
    * */
    this.GetByName = function(Name){
        for(i = 0;i < Users.length; i++){
            if(Users[i].Name.toLowerCase() === Name.toLowerCase()) return Users[i];
        }
        return null;
    };

    /*
    * Returned alle users die verbonden zijn
    * */
    this.GetUsers = function(){ return Users; };

    /*
    * Verwijdert de gegeven user
    * */
    this.DeleteUser = function(User){
        Users.splice(Users.indexOf(User), 1);
        io.sockets.emit(Command.USER_LIST, Users);
    };

    /*
    *  Creeërt een nieuwe user met de gegeven naam.
    *  Zet automatisch drawing & ready naar false.
    *   De user wordt toegevoegd aan een server-side lijst.
    * */
    this.User = function(Nickname){
        this.Name = Nickname;
        this.ID = IDCount;
        this.Ready = false;
        this.SetReady = function(Ready) {this.Ready = Ready; };
        IDCount++;
        Users.push(this);
        io.sockets.emit(Command.USER_LIST, Users);
    };
}

