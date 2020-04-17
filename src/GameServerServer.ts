
import { IGameServerServer } from "./Interfaces/IGameServerServer";
import { ILobby } from "./Interfaces/ILobby";
import { Socket, Server as netServer } from "net";

export enum MESSAGE_ID {
    FIRST,
	"Handshake" = FIRST,
	"Ping",
	"NotifyState",
    "BattleReport",
    INVALID,
    LAST = INVALID
};

export class GameServerServer extends netServer implements IGameServerServer {
    
    socketMap: Map<string, import("./Interfaces/IClient").IClient> = new Map();
    handlerList: import("./Interfaces/IMessageHandler").IMessageHandler[] = [];
    
    findAvailableServer(): ILobby | undefined {
        throw new Error("Method not implemented.");
    }

    removeClient(client: import("./Interfaces/IClient").IClient): void {
        throw new Error("Method not implemented.");
    }

}
