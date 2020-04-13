/// TODO : Rename this to SetVisibleUsername
import { IMessageBase, IMessageHandler } from "./MessageBase";
import { IServer } from "../Server";
import { Socket } from "net";

const size = 0;

export class SetVisibleUsername implements IMessageBase {
    
    valid : boolean = false;

    public username : string = "";

    constructor(protected messageId : number, buffer? : Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }

    serialize(): Buffer {
        // TODO : Implement this with an error code for the client to process
        throw new Error("Method not implemented.");
    }
    
    deserialize(buffer: Buffer): void {
        try {
            let usernameLength : number = buffer.readUInt8(0);

            const bufferSize = 1 + usernameLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }
            this.username = buffer.toString('utf8', 1, 1 + usernameLength);

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }

}

export class SetVisibleUsernameHandler implements IMessageHandler {
    
    constructor(readonly serverRef : IServer, readonly messageId : number) {

    }

    handle(buffer: Buffer, mySocket: Socket): boolean {
        let message : SetVisibleUsername = new SetVisibleUsername(this.messageId, buffer);

        if (message.valid) {
            return true;
        } else {
            return false;
        }
    }

    
}
