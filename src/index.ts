
import { config } from "dotenv";
import { UserServer } from "./UserServer";
import { GameServerServer } from "./GameServerServer";
import mongoose from "mongoose";
import { LobbyManager } from "./LobbyManager";

config();

const gameClientPort : number = Number(process.env.PORT);
const gameServerPort : number = Number(process.env.GSPORT);

mongoose.connect('mongodb://' + process.env.MONGODB + ':27017/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongo DB connected!");
    fillStaticContent();
});

const lobbyManager : LobbyManager = new LobbyManager();

const server : UserServer = new UserServer(lobbyManager);
server.start(gameClientPort);

const gameServerManager : GameServerServer = new GameServerServer();

function fillStaticContent() : void {

}

