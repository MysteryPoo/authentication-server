
import { config } from "dotenv";
import { UserServerManager } from "./UserServerManager";
import { GameServerServer } from "./GameServerServer";
import mongoose from "mongoose";
import { LobbyManager } from "./LobbyManager";
import { DatabaseUtility } from "./DatabaseUtility";
import { ContainerManager } from "./ContainerManager";

config();

const gameClientPort : number = Number(process.env.PORT);
const gameServerPort : number = Number(process.env.GSPORT);

mongoose.connect('mongodb://' + process.env.MONGODB + ':27017/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongo DB connected!");
    DatabaseUtility.fillAvatars();
});

const containerManager : ContainerManager = new ContainerManager();
const lobbyManager : LobbyManager = new LobbyManager(containerManager);

const server : UserServerManager = new UserServerManager(lobbyManager);
server.start(gameClientPort);

const gameServerManager : GameServerServer = new GameServerServer(lobbyManager);
gameServerManager.start(gameServerPort);



