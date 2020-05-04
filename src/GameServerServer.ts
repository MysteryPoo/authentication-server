
import { ServerBase } from "./Abstracts/ServerBase";
import { PingHandler } from "./Protocol/Common/PingHandler";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { BattleReportHandler } from "./Protocol/GameServerInterface/Handlers/BattleReport";
import { AuthenticationChallenge } from "./Protocol/Common/Challenge";
import { Socket } from "net";
import { ILobbyManager } from "./Interfaces/ILobbyManager";
import { IGameServer } from "./Interfaces/IGameServer";
import { GameServer } from "./GameServer";
import { IServer } from "./Interfaces/IServer";
import { HandshakeHandler } from "./Protocol/GameServerInterface/Handlers/Handshake";
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { IClient } from "./Interfaces/IClient";

export enum MESSAGE_ID {
    FIRST,
    "Challenge" = FIRST,
	"Handshake",
	"Ping",
	"NotifyState",
    "BattleReport",
    INVALID,
    LAST = INVALID
};

export class GameServerServer extends ServerBase implements IServer, IConnectionManager {

    socketMap: Map<string, IGameServer> = new Map();
    handlerList: IMessageHandler[] = [];

    constructor(readonly lobbyMgr : ILobbyManager) {
        super();
        this.registerHandler<PingHandler>(MESSAGE_ID.Ping, PingHandler);
        this.registerHandler<BattleReportHandler>(MESSAGE_ID.BattleReport, BattleReportHandler);
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.Handshake, HandshakeHandler);

        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketMap.clear();
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });
    }
    handleDisconnect(client: IClient): void {
        this.removeClient(client as IGameServer);
    }

    removeClient(server: IGameServer): void {
        this.socketMap.delete(server.uid);
        server.destroy();
    }

    private onConnection(rawSocket : Socket) : void {
        const server = new GameServer(rawSocket, this.handlerList, this);
        this.socketMap.set(server.uid, server);

        let message : AuthenticationChallenge = new AuthenticationChallenge(MESSAGE_ID.Challenge);
        message.salt = "ABCD";
        server.write(message.serialize());
    }

    public async start(port: number = 8081): Promise<boolean> {
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

}
