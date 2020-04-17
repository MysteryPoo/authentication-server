
import { ILobby } from "./ILobby";

export interface IGameServerManager {

    findAvailableServer() : ILobby | undefined;

}
