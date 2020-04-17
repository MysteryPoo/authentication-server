
import { IServer } from "./IServer";
import { ILobby } from "./ILobby";

export interface IGameServerServer extends IServer {

    findAvailableServer() : ILobby | undefined;

}
