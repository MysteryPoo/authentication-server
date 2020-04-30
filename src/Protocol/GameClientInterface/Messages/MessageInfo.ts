
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class MessageInfo extends MessageBase {

    id! : string;
    sender! : string;
    senderName! : string;
    subject! : string;
    message! : string;
    isNew! : boolean;
    recipient! : string;

    serialize(): Buffer {
        let idLength : number = Buffer.byteLength(this.id, 'utf-8');
        let senderLength : number = Buffer.byteLength(this.sender, 'utf-8');
        let senderNameLength : number = Buffer.byteLength(this.senderName, 'utf-8');
        let subjectLength : number = Buffer.byteLength(this.subject, 'utf-8');
        let messageLength : number = Buffer.byteLength(this.message, 'utf-8');

        let bufferSize : number = 11 + idLength + senderLength + senderNameLength + subjectLength + messageLength;

        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(idLength);
        helper.writeString(this.id);
        helper.writeUInt8(senderLength);
        helper.writeString(this.sender);
        helper.writeUInt8(senderNameLength);
        helper.writeString(this.senderName);
        helper.writeUInt8(subjectLength);
        helper.writeString(this.subject);
        helper.writeUInt8(messageLength);
        helper.writeString(this.message);
        helper.writeUInt8(this.isNew ? 1 : 0);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            let recipientLength : number = helper.readUInt8();
            this.recipient = helper.readString(recipientLength);

            let subjectLength : number = helper.readUInt8();
            this.subject = helper.readString(subjectLength);

            let messageLength : number = helper.readUInt8();
            this.message = helper.readString(messageLength);

            this.validate(buffer, 3 + recipientLength + subjectLength + messageLength);

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
