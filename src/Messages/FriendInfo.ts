/// TODO : Rename to AddRemoveFriend
import { IMessageBase } from "./MessageBase";
import { ObjectId } from "mongodb";

const size = 8;

export class AddRemoveFriend implements IMessageBase {
    
    valid: boolean = false;

    public id : ObjectId = new ObjectId();
    public username : string = "";
    public online : boolean = false;
    public remove : boolean = false;

    constructor(protected messageId: number, buffer?: Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }
    
    serialize(): Buffer {
        let idLength : number = this.id.toHexString().length;
        let usernameLength : number = this.username.length;
        let flags : number = 0;
        if (this.online) {
            flags |= 0b01;
        }
        if (this.remove) {
            flags |= 0b10;
        }

        let bufferSize : number = size + idLength + usernameLength;
        let buffer : Buffer = Buffer.allocUnsafe(bufferSize);

        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(idLength, 5);
        buffer.write(this.id.toHexString(), 6, this.id.toHexString().length, 'utf-8');
        buffer.writeUInt8(usernameLength, 7 + idLength);
        buffer.write(this.username, 8 + idLength, this.username.length, 'utf-8');
        buffer.writeUInt8(flags, 9 + idLength + usernameLength);
        return buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let idLength : number = buffer.readUInt8(0);

            const bufferSize = 2 + idLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }

            this.id = new ObjectId(buffer.toString('utf8', 1, 1 + idLength));
            let flags = buffer.readUInt8(2 + idLength);
            this.remove = flags & 0b1 ? true : false;

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }

}
