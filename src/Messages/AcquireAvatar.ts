/// TODO : Rename to GetAvatarURL
import { IMessageBase, IMessageHandler } from "./MessageBase";
import { IServer } from "../Server";
import { IClient } from "../Client";
import { ObjectId } from "mongodb";

const size : number = 6;

export class GetAvatarURL implements IMessageBase {

    valid : boolean = false;

    public url : string = "";
    public id : ObjectId = new ObjectId();

    constructor(protected messageId : number, buffer?: Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }

    public serialize() : Buffer {
        let urlLength : number = Buffer.byteLength(this.url, 'utf8');
        let bufferSize : number = size + urlLength;
        let buffer = Buffer.allocUnsafe(bufferSize);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(urlLength, 5);
        buffer.write(this.url, 6, this.url.length, 'utf8');
        return buffer;
    }

    public deserialize(buffer : Buffer) : void {
        try {
            let idLength : number = buffer.readUInt8(0);

            const bufferSize = 1 + idLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }

            this.id = new ObjectId(buffer.toString('utf8', 1, 1 + idLength));

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
}

export class GetAvatarURLHandler implements IMessageHandler {
    
    constructor(readonly serverRef: IServer, readonly messageId: number) {

    }

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : GetAvatarURL = new GetAvatarURL(this.messageId, buffer);

        if (message.valid) {
            // TODO : Implement this
            return true;
        } else {
            return false;
        }
    }
    
}
