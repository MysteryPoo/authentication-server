
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class GetNextAward extends MessageBase {

    credits! : number;
    premium! : number;
    experience! : number;
    avatarId! : string;
    avatarUri! : string;

    serialize(): Buffer {
        let avatarIdLength : number = Buffer.byteLength(this.avatarId, 'utf-8');
        let avatarUriLength : number = Buffer.byteLength(this.avatarUri, 'utf-8');

        let bufferSize : number = 13 + avatarIdLength + avatarUriLength;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        // Header
        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        // Data
        helper.writeUInt16LE(this.credits);
        helper.writeUInt16LE(this.premium);
        helper.writeUInt16LE(this.experience);
        helper.writeUInt8(avatarIdLength);
        helper.writeString(this.avatarId);
        helper.writeUInt8(avatarUriLength);
        helper.writeString(this.avatarUri);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
