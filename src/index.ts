
import { config } from "dotenv";
import { Server } from "./Server";
import mongoose from "mongoose";

config();

const port : number = Number(process.env.PORT);

mongoose.connect('mongodb://' + process.env.MONGODB + ':27017/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongo DB connected!");
});

const server : Server = new Server();
server.start(port);
