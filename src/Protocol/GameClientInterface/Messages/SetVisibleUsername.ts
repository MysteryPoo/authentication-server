
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class SetVisibleUsername extends MessageBase {

    public username! : string;

    serialize(): Buffer {
        // TODO : Implement this with an error code for the client to process
        throw new Error("Method not implemented.");
    }
    
    deserialize(buffer: Buffer): void {
        try {
            let bufferHelper : BufferHelper = new BufferHelper(buffer);

            let usernameLength : number = bufferHelper.readUInt8();

            const bufferSize = 1 + usernameLength;

            this.validate(buffer, bufferSize);
            
            this.username = bufferHelper.readString(usernameLength);

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }

}
