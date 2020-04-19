
import { IServer } from "./Interfaces/IServer";
import { Socket, Server as netServer } from "net";
import { Client } from "./Client";
import { IClient } from "./Interfaces/IClient";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { AuthenticationChallenge } from "./Protocol/GameClientInterface/Challenge";
import { GetAvatarURLHandler } from "./Protocol/GameClientInterface/AcquireAvatar";
import { PingHandler } from "./Protocol/Common/Ping";
import { HandshakeHandler } from "./Protocol/GameClientInterface/Handshake";
import { SetVisibleUsernameHandler } from "./Protocol/GameClientInterface/AccountInfo";
import { ServerBase } from "./ServerBase";
import { LobbyManager } from "./LobbyManager";

export enum MESSAGE_ID {
    FIRST,
    "Challenge" = FIRST,
    "Handshake",
    "Ping",
    "AcquireAvatar",
    "NewLobby",
    "LobbyData",
    "AcquireDice",
    "Filler1",
    "Filler2",
    "SetVisibleUsername",
    "Filler4",
    "Filler5",
    "Filler6",
    "Filler7",
    "LobbyPlayer",
    INVALID,
    LAST = INVALID
};

export class UserServer extends ServerBase implements IServer {

    public handlerList : Array<IMessageHandler> = [];

    private port : number = 0;

    constructor(readonly lobbyMgr : LobbyManager) {
        super();
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.Handshake, HandshakeHandler);
        this.registerHandler<GetAvatarURLHandler>(MESSAGE_ID.AcquireAvatar, GetAvatarURLHandler);
        this.registerHandler<PingHandler>(MESSAGE_ID.Ping, PingHandler);
        this.registerHandler<SetVisibleUsernameHandler>(MESSAGE_ID.SetVisibleUsername, SetVisibleUsernameHandler);
        
        this.on('connection', this.onConnection);
        this.on('close', () => {
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
        this.socketMap.set(client.uid, client);

        let message : AuthenticationChallenge = new AuthenticationChallenge(MESSAGE_ID.Challenge);
        message.salt = "ABCD";
        client.write(message.serialize());
    }

    public removeClient(client : IClient) : void {
        this.socketMap.delete(client.uid);
        client.destroy();
    }

    private registerHandler<T extends IMessageHandler>(messageId : MESSAGE_ID, handler : {new(serverRef : IServer, messageId : MESSAGE_ID) : T; }) {
        this.handlerList[messageId] = new handler(this, messageId);
    }

    public authenticateClient(newId : string, client : IClient) : void {
        this.socketMap.set(newId, client);
        this.socketMap.delete(client.uid);
    }

}
