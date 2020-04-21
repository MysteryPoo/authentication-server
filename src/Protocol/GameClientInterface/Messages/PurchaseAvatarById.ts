
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class PurchaseAvatarById extends MessageBase {

    public url! : string;
    public id! : string;

    public serialize() : Buffer {
        let urlLength : number = Buffer.byteLength(this.url, 'utf8');
        let bufferSize : number = 6 + urlLength;

        let bufferHelper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));
        bufferHelper.writeUInt8(this.messageId);
        bufferHelper.writeUInt32LE(bufferSize);
        bufferHelper.writeUInt8(urlLength);
        bufferHelper.writeString(this.url);

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
