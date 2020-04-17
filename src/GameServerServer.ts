
import { IGameServerManager } from "./Interfaces/IGameServerManager";
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

export class GameServerManager implements IGameServerManager {
    
    findAvailableServer(): ILobby | undefined {
        throw new Error("Method not implemented.");
    }

    
}
