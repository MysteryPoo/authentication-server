
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
            const bufferSize = 4;
            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }
            this.time = buffer.readUInt32LE(0);
        } catch (e) {
            console.error(e);
        }
    }
}
