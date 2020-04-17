
import { MessageBase } from "../Common/MessageBase";

export class LobbyData extends MessageBase {

    public numClients : number = 0;
    public maxClients : number = 0;
    public isPublic : boolean = false;

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
            let bufferSize : number = 2;
            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }

            this.isPublic = buffer.readUInt8(0) === 0 ? false : true;
            this.maxClients = buffer.readUInt8(1);

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }
    
}
