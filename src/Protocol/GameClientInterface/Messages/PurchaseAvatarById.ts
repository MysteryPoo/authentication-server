
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class PurchaseAvatarById extends MessageBase {

    public message! : string;
    public id! : string;

    public serialize() : Buffer {
        let messageLength : number = Buffer.byteLength(this.message, 'utf8');
        let bufferSize : number = 6 + messageLength;

        let bufferHelper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));
        bufferHelper.writeUInt8(this.messageId);
        bufferHelper.writeUInt32LE(bufferSize);
        bufferHelper.writeUInt8(messageLength);
        bufferHelper.writeString(this.message);

        return bufferHelper.buffer;
    }

    public deserialize(buffer : Buffer) : void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            let idLength : number = helper.readUInt8();

            const bufferSize = 1 + idLength;

            this.validate(buffer, bufferSize);

            this.id = helper.readString(idLength);

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
}
