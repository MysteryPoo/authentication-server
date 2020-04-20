
import { MessageBase } from "../../Abstracts/MessageBase";

export class LobbyPlayer extends MessageBase {

    public clientListIndex! : number;
    public id! : string;
    public isReady! : boolean;
    public requestingToLeaveLobby! : boolean;

    serialize(): Buffer {
        let idLength = Buffer.byteLength(this.id, 'utf-8');
        
        let bufferSize : number = 8 + idLength;
        let buffer : Buffer = Buffer.allocUnsafe(bufferSize);

        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(this.clientListIndex, 5);
        buffer.writeUInt8(idLength, 6);
        buffer.write(this.id, 7, idLength, 'utf-8');
        buffer.writeUInt8(this.isReady ? 1 : 0, 7 + idLength);
        
        return buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            this.validate(buffer, 1);

            let flags : number = buffer.readUInt8(0);

            this.isReady = (flags & 0b01) > 0;
            this.requestingToLeaveLobby = (flags & 0b10) > 0;

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }
    
}
