
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class PurchaseDiceById extends MessageBase {

    public url! : string;
    public id! : string;

    public serialize() : Buffer {
        let urlLength : number = Buffer.byteLength(this.url, 'utf8');
        let bufferSize : number = 6 + urlLength;

        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));
        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(urlLength);
        helper.writeString(this.url);

        return helper.buffer;
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
