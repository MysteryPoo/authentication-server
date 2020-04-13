
import { Socket, Server as netServer } from "net";
import { Client } from "./Client";
import { IMessageHandler } from "./Messages/MessageBase";
import { AcquireAvatarHandler } from "./Messages/AcquireAvatar";
import { PingHandler } from "./Messages/Ping";

export interface IServer {
    socketList : Array<Client>;
    handlerList : Array<IMessageHandler>;
}

export enum MESSAGE_ID {
    FIRST,
    "AcquireAvatar" = FIRST,
    "AcquireDice",
    "Challenge",
    "MessageBase",
    "Ping",
    "SetUsername",
    LAST = MESSAGE_ID.SetUsername
};

export class Server extends netServer implements IServer {

    socketList : Array<Client> = [];
    handlerList : Array<IMessageHandler> = [];

    private port : number = 0;

    constructor() {
        super();
        this.handlerList[MESSAGE_ID.AcquireAvatar] = new AcquireAvatarHandler(this, MESSAGE_ID.AcquireAvatar);
        this.handlerList[MESSAGE_ID.Ping] = new PingHandler(this, MESSAGE_ID.Ping);
        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketList = [];
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
            this.port = port;
            this.listen( {port: port, host: "0.0.0.0"}, () => {
                resolve(true);
            });
        });
    }

    public async stop(): Promise<boolean> {
        console.log("Stopping server...");
        return new Promise<boolean>( (resolve, reject) => {
            this.close(() => {
                console.log("Server shutdown.");
                resolve(true);
            });
        });
    }

    private onConnection( rawSocket : Socket) {
        const socket = new Client(rawSocket, this);
        this.socketList.push(socket);
    }

}
