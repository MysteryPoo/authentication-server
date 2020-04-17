import { IServer } from "../../src/Interfaces/IServer";
import { IClient } from "../../src/Interfaces/IClient";
import { IMessageHandler } from "../../src/Interfaces/IMessageHandler";

export class ServerMock implements IServer {
    
    handlerList: IMessageHandler[] = [];
    socketMap : Map<string, IClient> = new Map();

    removeClient(client: IClient): void {
        throw new Error("Method not implemented.");
    }
}
