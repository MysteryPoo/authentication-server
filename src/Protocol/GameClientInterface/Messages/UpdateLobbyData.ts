
import { MessageBase } from "../../../Abstracts/MessageBase";

export class UpdateLobbyData extends MessageBase {

    public numClients! : number;
    public maxClients! : number;
    public isPublic! : boolean;

    serialize(): Buffer {
        let bufferSize : number = 8;
        let buffer = Buffer.allocUnsafe(bufferSize);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(this.numClients, 5);
        buffer.writeUInt8(this.maxClients, 6);
        buffer.writeUInt8(this.isPublic ? 1 : 0, 7);
        return buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            this.validate(buffer, 2);

            this.isPublic = buffer.readUInt8(0) === 0 ? false : true;
            this.maxClients = buffer.readUInt8(1);

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }
    
}
