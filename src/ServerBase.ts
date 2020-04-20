
import { Server as netServer } from "net";
import { IServer } from "./Interfaces/IServer";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { IClient } from "./Interfaces/IClient";

export abstract class ServerBase extends netServer implements IServer {

    abstract authenticateClient(newId: string, client: IClient): void;

    protected socketMap: Map<string, IClient> = new Map();

    public handlerList: IMessageHandler[] = [];

    abstract removeClient(client: IClient): void;

}
