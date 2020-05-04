
import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { ISocket } from "../Interfaces/ISocket";

export abstract class MessageHandlerBase implements IMessageHandler {

    constructor(public messageId: number) {

    }

    abstract handle(buffer : Buffer, mySocket : ISocket) : boolean;
    
}
