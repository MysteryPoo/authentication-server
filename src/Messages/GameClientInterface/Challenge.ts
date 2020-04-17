/// TODO : Rename to AuthenticationChallenge
import { IMessageBase } from "../../Interfaces/IMessageBase";

const size = 6;

export class AuthenticationChallenge implements IMessageBase {
    
    valid : boolean = false;

    public salt : string = "";

    constructor(protected messageId: number) {

    }
    
    serialize(): Buffer {
        let saltLength : number = Buffer.byteLength(this.salt, 'utf-8');
        let bufferSize : number = size + saltLength;
        let buffer : Buffer = Buffer.allocUnsafe(bufferSize);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(saltLength, 5);
        buffer.write(this.salt, 6, saltLength, "utf-8");

        return buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
