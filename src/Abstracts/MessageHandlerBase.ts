
import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { IServer } from "../Interfaces/IServer";
import { ISocket } from "../Interfaces/ISocket";

export abstract class MessageHandlerBase implements IMessageHandler {

    constructor(readonly serverRef: IServer, readonly messageId: number) {

    }

    abstract handle(buffer: Buffer, mySocket: ISocket): boolean;
    
}
