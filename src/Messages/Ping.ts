
//import { IMessageHandler } from "../IMessageHandler";
import { MessageBase } from "./MessageBase";

const size : number = 9;

export class Ping extends MessageBase {

    public time: number = 0;

    constructor(protected messageId : number, protected buffer?: Buffer) {
        super(messageId, buffer);
    }

    public serialize() : Buffer {
        let buffer = Buffer.allocUnsafe(size);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(size, 1);
        buffer.writeUInt32LE(this.time, 5);
        return buffer;
    }

    public deserialize(buffer: Buffer) : void {
        try {
            this.time = buffer.readUInt32LE(0);
        } catch (e) {
            console.log("Error: Attempting to deserialize non-Ping as Ping.");
            console.log(e);
        }
    }
}
/*
export class PingHandler implements IMessageHandler {
    private socket : Socket;
    private ping : Ping;

    constructor(socket : Socket, ping : Ping) {
        this.socket = socket;
        this.ping = ping;
    }

    public handle() : void {
        if(this.ping.isValid) {
            this.socket.write(this.ping.serialize());
        }
    }
}
*/