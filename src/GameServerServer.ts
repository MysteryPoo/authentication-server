
import { IGameServerServer } from "./Interfaces/IGameServerServer";
import { ILobby } from "./Interfaces/ILobby";
import { ServerBase } from "./Abstracts/ServerBase";
import { PingHandler } from "./Protocol/Common/Ping";

export enum MESSAGE_ID {
    FIRST,
	"Handshake" = FIRST,
	"Ping",
	"NotifyState",
    "BattleReport",
    INVALID,
    LAST = INVALID
};

export class GameServerServer extends ServerBase implements IGameServerServer {
    
    socketMap: Map<string, import("./Interfaces/IClient").IClient> = new Map();
    handlerList: import("./Interfaces/IMessageHandler").IMessageHandler[] = [];

    constructor() {
        super();
        this.registerHandler<PingHandler>(MESSAGE_ID.Ping, PingHandler);
    }
    
    findAvailableServer(): ILobby | undefined {
        throw new Error("Method not implemented.");
    }

    removeClient(client: import("./Interfaces/IClient").IClient): void {
        throw new Error("Method not implemented.");
    }

}
