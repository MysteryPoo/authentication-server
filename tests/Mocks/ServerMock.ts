import { IServer } from "../../src/Server";
import { Client } from "../../src/Client";
import { IMessageHandler } from "../../src/Messages/MessageBase";

export class ServerMock implements IServer {
    handlerList: IMessageHandler[] = [];
    socketList : Array<Client> = [];
}
