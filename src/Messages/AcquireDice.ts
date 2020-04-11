/// TODO : Rename to GetDiceURL
import { IMessageBase } from "./MessageBase";

const size : number = 6;

export class GetDiceURL implements IMessageBase {
    
    valid: boolean = false;

    public url : string = "";
    public id : string = "";

    constructor(protected messageId : number, buffer?: Buffer) {
        if(buffer) {
            this.deserialize(buffer);
        }
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
            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
}
