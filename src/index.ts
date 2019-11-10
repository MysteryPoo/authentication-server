
import { config } from "dotenv";
import { Server } from "./Server";

config();

const port : number = Number(process.env.PORT);

const server : Server = new Server();
server.start(port);
