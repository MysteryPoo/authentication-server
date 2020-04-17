
import { IClient } from "./IClient";
import { IMessageHandler } from "./IMessageHandler";

export interface IServer {
    socketMap : Map<string, IClient>;
    handlerList : Array<IMessageHandler>;

    removeClient(client : IClient) : void;
}
