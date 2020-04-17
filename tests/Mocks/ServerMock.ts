import { IServer } from "../../src/Interfaces/IServer";
import { Client } from "../../src/Client";
import { IClient } from "../../src/Interfaces/IClient";
import { IMessageHandler } from "../../src/Interfaces/IMessageHandler";

export class ServerMock implements IServer {
    handlerList: IMessageHandler[] = [];
    socketList : Array<Client> = [];
    socketMap : Map<string, IClient> = new Map();
}
