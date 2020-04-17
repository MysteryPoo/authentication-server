
import { IClient } from "./IClient";
import { IGameServer } from "./IGameServer";

export enum ERROR {
    OK,
    WRONG_VERSION,
    INSUFFICIENT_SPACE,
    DUPLICATE
};

export interface ILobby {

    isPublic : boolean;
    maxPlayers : number;
    clientList : Array<IClient>;
    numberOfLaunchAttempts : number;
    gameServer : IGameServer | null;
    gameVersion : number;

    addPlayer(client : IClient) : ERROR;
    containsPlayer(client : IClient) : boolean;
    removePlayer(client: IClient) : boolean;
    isReadyToQueue() : boolean;
    requestGameServer() : void; // This will change
    getAvailableSlots() : number;
    setPublic(isPublic : boolean) : void;
    update() : void;
}
