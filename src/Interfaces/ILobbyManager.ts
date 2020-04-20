
import { ILobby } from "./ILobby";
import { IClient } from "./IClient";

export enum QUEUE_ERROR {
    OK,
    ALREADY_STARTED,
    INSUFFICIENT_PLAYERS,
    PLAYERS_NOT_READY
}

export interface ILobbyManager {

    lobbyList : Array<ILobby>;
    lobbyQueue : Array<ILobby>;

    createLobby(host : IClient, isPublic : boolean, maxPlayers : number) : ILobby;
    getLobbyOfClient(client : IClient) : ILobby | undefined;
    removeLobby(lobby : ILobby) : boolean;
    addToQueue(lobby : ILobby) : QUEUE_ERROR;
    removeFromQueue(lobby : ILobby) : boolean;

}
