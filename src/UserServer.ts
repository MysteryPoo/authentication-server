
import { IServer } from "./Interfaces/IServer";
import { Socket, Server as netServer } from "net";
import { Client } from "./Client";
import { IClient } from "./Interfaces/IClient";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { AuthenticationChallenge } from "./Messages/GameClientInterface/Challenge";
import { GetAvatarURLHandler } from "./Messages/GameClientInterface/AcquireAvatar";
import { PingHandler } from "./Messages/Ping";
import { HandshakeHandler } from "./Messages/GameClientInterface/Handshake";
import { SetVisibleUsernameHandler } from "./Messages/GameClientInterface/AccountInfo";

export enum MESSAGE_ID {
    FIRST,
    "Challenge" = FIRST,
    "Handshake",
    "Ping",
    "AcquireAvatar",
    "AcquireDice",
    "MessageBase",
    "Filler3",
    "Filler1",
    "Filler2",
    "SetVisibleUsername",
    INVALID,
    LAST = INVALID
};

export class UserServer extends netServer implements IServer {

    socketList : Array<Client> = [];
    socketMap : Map<string, IClient> = new Map();
    handlerList : Array<IMessageHandler> = [];

    private port : number = 0;

    constructor() {
        super();
        this.handlerList[MESSAGE_ID.Handshake] = new HandshakeHandler(this, MESSAGE_ID.Handshake);
        this.handlerList[MESSAGE_ID.AcquireAvatar] = new GetAvatarURLHandler(this, MESSAGE_ID.AcquireAvatar);
        this.handlerList[MESSAGE_ID.Ping] = new PingHandler(this, MESSAGE_ID.Ping);
        this.handlerList[MESSAGE_ID.SetVisibleUsername] = new SetVisibleUsernameHandler(this, MESSAGE_ID.SetVisibleUsername);
        
        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketList = [];
            this.socketMap.clear();
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
        const client = new Client(rawSocket, this);
        this.socketList.push(client);
        this.socketMap.set(client.uid, client);

        let message : AuthenticationChallenge = new AuthenticationChallenge(MESSAGE_ID.Challenge);
        message.salt = "ABCD";
        client.write(message.serialize());
    }

}
