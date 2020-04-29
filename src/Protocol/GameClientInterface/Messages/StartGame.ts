
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class StartGame extends MessageBase {

    ip! : string;
    port! : number;
    token! : number;

    serialize(): Buffer {
        let ipLength : number = Buffer.byteLength(this.ip, 'utf-8');
        
        let bufferSize : number = 10 + ipLength;

        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(ipLength);
        helper.writeString(this.ip);
        helper.writeUInt16LE(this.port);
        helper.writeUInt16LE(this.token);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
