
import { IServer } from "../Interfaces/IServer";
import { IClient } from "../Interfaces/IClient";

export interface IMessageHandler {

    readonly serverRef : IServer;
    readonly messageId : number;
    handle(buffer : Buffer, mySocket: IClient) : boolean;
}
