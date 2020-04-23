
import { Server as netServer } from "net";
import { IServer } from "../Interfaces/IServer";
import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { IClient } from "../Interfaces/IClient";

export abstract class ServerBase extends netServer implements IServer {

    protected socketMap: Map<string, IClient> = new Map();

    public handlerList: IMessageHandler[] = [];

    abstract removeClient(client: IClient): void;

    protected registerHandler<T extends IMessageHandler>(messageId : number, handler : {new(serverRef : IServer, messageId : number) : T; }) {
        this.handlerList[messageId] = new handler(this, messageId);
    }

}
