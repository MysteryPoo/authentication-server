
import { IGameServer } from "./IGameServer";
import { IUserClient } from "./IUserClient";

export enum ERROR {
    OK,
    WRONG_VERSION,
    INSUFFICIENT_SPACE,
    DUPLICATE
};

export interface ILobby {

    isPublic : boolean;
    maxPlayers : number;
    clientList : Array<IUserClient>;
    numberOfLaunchAttempts : number;
    gameServer : IGameServer | null;
    gameServerPassword : string;
    gameVersion : number;

    addPlayer(client : IUserClient) : ERROR;
    containsPlayer(client : IUserClient) : boolean;
    removePlayer(client: IUserClient) : boolean;
    isReadyToQueue() : boolean;
    requestGameServer() : void; // This will change
    getAvailableSlots() : number;
    setPublic(isPublic : boolean) : void;
    update() : void;
}
