
import { MessageHandlerBase } from "../../Abstracts/MessageHandlerBase";
import { ISocket } from "../../Interfaces/ISocket";
import { Ping } from "./Ping";

export class PingHandler extends MessageHandlerBase {

    handle(buffer: Buffer, mySocket: ISocket): boolean {
        let message: Ping = new Ping(this.messageId, buffer);
        
        if (message.valid) {
            return mySocket.write(message.serialize());
        }
        else {
            return false;
        }
    }

}
