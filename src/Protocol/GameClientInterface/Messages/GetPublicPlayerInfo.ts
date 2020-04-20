
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class GetPublicPlayerInfo extends MessageBase {

    public id! : string;
    public username! : string;
    public avatarUri! : string;
    public diceUri! : string;
    public rank! : number;

    serialize(): Buffer {
        let idLength : number = Buffer.byteLength(this.id, 'utf-8');
        let usernameLength : number = Buffer.byteLength(this.username, 'utf-8');
        let avatarURILength : number = Buffer.byteLength(this.avatarUri, 'utf-8');
        let diceURILength : number = Buffer.byteLength(this.diceUri, 'utf-8');

        let bufferSize : number = 10 + idLength + usernameLength + avatarURILength + diceURILength;
        let bufferHelper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        bufferHelper.writeUInt8(this.messageId);
        bufferHelper.writeUInt32LE(bufferSize);
        bufferHelper.writeUInt8(idLength);
        bufferHelper.writeString(this.id);
        bufferHelper.writeUInt8(usernameLength);
        bufferHelper.writeString(this.username);
        bufferHelper.writeUInt8(avatarURILength);
        bufferHelper.writeString(this.avatarUri);
        bufferHelper.writeUInt8(diceURILength);
        bufferHelper.writeString(this.diceUri);
        bufferHelper.writeUInt8(this.rank);

        return bufferHelper.buffer;
    }
    deserialize(buffer: Buffer): void {
        try {
            let bufferHelper : BufferHelper = new BufferHelper(buffer);
            let idLength : number = bufferHelper.readUInt8();

            this.validate(buffer, 1 + idLength);

            this.id = bufferHelper.readString(idLength);

            this.valid = true;

        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
    
}
