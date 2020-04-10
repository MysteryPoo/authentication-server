
import { MessageBase } from "./MessageBase";

const size : number = 6;

export class AcquireAvatar extends MessageBase {

    public url : string = "";
    public id : string = "";

    constructor(protected messageId : number, protected buffer?: Buffer) {
        super(messageId, buffer);
    }

    public serialize() : Buffer {
        let urlLength : number = Buffer.byteLength(this.url, 'utf8');
        let bufferSize : number = size + urlLength;
        let buffer = Buffer.allocUnsafe(bufferSize);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(urlLength, 5);
        buffer.write(this.url, 6, this.url.length, 'utf8');
        return buffer;
    }

    public deserialize(buffer : Buffer) : void {
        try {
            let idLength : number = buffer.readUInt8(0);

            const bufferSize = 1 + idLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }

            this.id = buffer.toString('utf8', 1, 1 + idLength);
        } catch (e) {
            console.error(e);
        }
    }
}
