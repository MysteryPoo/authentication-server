
import { IClient } from "./IClient";

export interface ILobby {

    isPublic : boolean;
    clientList : Array<IClient>;

    addPlayer(client : IClient) : void;
    containsPlayer(client : IClient) : boolean;
    removePlayer(client: IClient) : boolean;
    isReadyToQueue() : boolean;
    requestGameServer() : void; // This will change
}
