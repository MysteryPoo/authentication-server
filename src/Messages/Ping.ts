
import { IMessageBase } from "./MessageBase";

const size : number = 9;

export class Ping implements IMessageBase {

    valid : boolean = false;

    public time: number = 0;

    constructor(protected messageId : number, buffer?: Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
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
            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
}