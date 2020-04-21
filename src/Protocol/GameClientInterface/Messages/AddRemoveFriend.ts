
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class AddRemoveFriend extends MessageBase {

    public id! : string;
    public username! : string;
    public online! : boolean;
    public remove! : boolean;
    
    serialize(): Buffer {
        let idLength : number = Buffer.byteLength(this.id, 'utf-8');
        let usernameLength : number = Buffer.byteLength(this.username, 'utf-8');
        let flags : number = 0;
        flags |= this.online ? 0b01 : 0b00;
        flags |= this.remove ? 0b10 : 0b00;

        let bufferSize : number = 8 + idLength + usernameLength;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(idLength);
        helper.writeString(this.id);
        helper.writeUInt8(usernameLength);
        helper.writeString(this.username);
        helper.writeUInt8(flags);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            let idLength : number = helper.readUInt8();

            const bufferSize = 2 + idLength;

            this.validate(buffer, bufferSize);

            this.id = helper.readString(idLength);
            
            let flags = helper.readUInt8();
            this.remove = flags & 0b1 ? true : false;

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }

}
