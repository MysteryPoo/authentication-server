
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
    gameServerPort : number;
    gameServerPassword : string;
    gameVersion : number;

    addPlayer(client : IUserClient) : ERROR;
    containsPlayer(client : IUserClient) : boolean;
    containsPlayerId(clientId : string) : boolean;
    removePlayer(client: IUserClient) : boolean;
    isReadyToQueue() : boolean;
    requestGameServer() : Promise<void>; // This will change
    getAvailableSlots() : number;
    setPublic(isPublic : boolean) : void;
    start() : void;
    update() : void;
}
