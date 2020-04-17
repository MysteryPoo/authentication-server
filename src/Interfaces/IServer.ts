
import { IClient } from "./IClient";
import { IMessageHandler } from "./IMessageHandler";
import { Client } from "../Client"; // TODO : Remove this

export interface IServer {
    socketList : Array<Client>; // TODO : Remove this
    socketMap : Map<string, IClient>;
    handlerList : Array<IMessageHandler>;
}
