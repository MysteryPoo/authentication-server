
import { ILobby } from "./ILobby";
import { IClient } from "./IClient";
import { ContainerManager } from "../ContainerManager";

export enum QUEUE_ERROR {
    OK,
    NO_SERVER_AVAILABLE,
    ALREADY_STARTED,
    INSUFFICIENT_PLAYERS,
    PLAYERS_NOT_READY
}

export interface ILobbyManager {

    lobbyList : Array<ILobby>;
    lobbyQueue : Array<ILobby>;
    containerManager : ContainerManager;

    createLobby(host : IClient, isPublic : boolean, maxPlayers : number) : ILobby;
    getLobbyOfClient(client : IClient) : ILobby | undefined;
    getLobbyOfClientId(clientId : string) : ILobby | undefined;
    removeLobby(lobby : ILobby) : boolean;
    addToQueue(lobby : ILobby) : QUEUE_ERROR;
    removeFromQueue(lobby : ILobby) : boolean;

}
