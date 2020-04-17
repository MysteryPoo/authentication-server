
import { IMessageBase } from "../../Interfaces/IMessageBase";
import { IMessageHandler } from "../../Interfaces/IMessageHandler";
import { IServer } from "../../Interfaces/IServer";
import { IClient } from "../../Interfaces/IClient";

const size : number = 13;

export class Ping implements IMessageBase {

    valid : boolean = false;

    public time: bigint = BigInt(0);

    constructor(protected messageId : number, buffer?: Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }

    public serialize() : Buffer {
        let buffer = Buffer.allocUnsafe(size);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(size, 1);
        buffer.writeBigUInt64LE(this.time, 5);
        return buffer;
    }

    public deserialize(buffer: Buffer) : void {
        try {
            const bufferSize = 8;
            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }
            this.time = buffer.readBigUInt64LE(0);
            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
}

export class PingHandler implements IMessageHandler {

    constructor(readonly serverRef : IServer, readonly messageId : number) {

    }

    public handle(buffer : Buffer, myClient: IClient) : boolean {
        let message : Ping = new Ping(this.messageId, buffer);

        if (message.valid) {
            return myClient.write(message.serialize());
        } else {
            return false;
        }
    }
}
