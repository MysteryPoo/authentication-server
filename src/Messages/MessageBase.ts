import { IServer } from "../Server";
import { IClient } from "../Client";

export interface IMessageBase {

    valid : boolean;
    serialize() : Buffer;
    deserialize(buffer : Buffer) : void;
    
}

export interface IMessageHandler {

    readonly serverRef : IServer;
    readonly messageId : number;
    handle(buffer : Buffer, mySocket: IClient) : boolean;
}
