
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class GetFriendList extends MessageBase {

    public id! : string;
    public username! : string;
    public online! : boolean;
    public removeFromClient! : boolean;
    
    serialize(): Buffer {
        // TODO : Refactor serialization to compress flags into a single byte
        let idLength : number = Buffer.byteLength(this.id, 'utf-8');
        let usernameLength : number = Buffer.byteLength(this.username, 'utf-8');

        let bufferSize : number = 4 + idLength + usernameLength;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(idLength);
        helper.writeString(this.id);
        helper.writeUInt8(usernameLength);
        helper.writeString(this.username);
        helper.writeUInt8(this.online ? 1 :0);
        helper.writeUInt8(this.removeFromClient ? 1 : 0);

        return helper.buffer;
    }
    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
