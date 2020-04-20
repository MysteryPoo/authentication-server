/// TODO : Rename to AddRemoveFriend
import { MessageBase } from "../../Abstracts/MessageBase";
import { IMessageHandler } from "../../Interfaces/IMessageHandler";
import { IServer } from "../../Interfaces/IServer";
import { IClient } from "../../Interfaces/IClient";
import { ObjectId } from "mongodb";

const size = 8;

export class AddRemoveFriend extends MessageBase {

    public id! : ObjectId;
    public username! : string;
    public online! : boolean;
    public remove! : boolean;
    
    serialize(): Buffer {
        let idLength : number = Buffer.byteLength(this.id.toHexString(), 'utf-8');
        let usernameLength : number = Buffer.byteLength(this.username, 'utf-8');
        let flags : number = 0;
        flags |= this.online ? 0b01 : 0b00;
        flags |= this.remove ? 0b10 : 0b00;

        let bufferSize : number = size + idLength + usernameLength;
        let buffer : Buffer = Buffer.allocUnsafe(bufferSize);

        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(idLength, 5);
        buffer.write(this.id.toHexString(), 6, idLength, 'utf-8');
        buffer.writeUInt8(usernameLength, 6 + idLength);
        buffer.write(this.username, 7 + idLength, usernameLength, 'utf-8');
        buffer.writeUInt8(flags, 7 + idLength + usernameLength);
        return buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let idLength : number = buffer.readUInt8(0);

            const bufferSize = 2 + idLength;

            this.validate(buffer, bufferSize);

            this.id = new ObjectId(buffer.toString('utf8', 1, 1 + idLength));
            let flags = buffer.readUInt8(1 + idLength);
            this.remove = flags & 0b1 ? true : false;

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }

}

export class AddRemoveFriendHandler implements IMessageHandler {
    
    constructor(readonly serverRef: IServer, readonly messageId: number) {

    }

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : AddRemoveFriend = new AddRemoveFriend(this.messageId, buffer);

        if (message.valid) {
            // TODO : Implement this
            return true;
        } else {
            return false;
        }
    }
    
}
