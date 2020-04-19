
import { IMessageHandler } from "../../Interfaces/IMessageHandler";
import { IServer } from "../../Interfaces/IServer";
import { IClient } from "../../Interfaces/IClient";

export abstract class MessageHandlerBase implements IMessageHandler {

    constructor(readonly serverRef: IServer, readonly messageId: number) {

    }

    abstract handle(buffer: Buffer, mySocket: IClient): boolean;
    
}
