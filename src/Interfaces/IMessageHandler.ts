
import { IServer } from "../Interfaces/IServer";
import { ISocket } from "./ISocket";

export interface IMessageHandler {

    readonly serverRef : IServer;
    readonly messageId : number;
    handle(buffer : Buffer, mySocket: ISocket) : boolean;
}
