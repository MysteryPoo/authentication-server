/// TODO : Rename this to SetVisibleUsername
import { IMessageBase } from "./MessageBase";

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