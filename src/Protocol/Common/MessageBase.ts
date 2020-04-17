
import { IMessageBase } from "../../Interfaces/IMessageBase";

export abstract class MessageBase implements IMessageBase {
    
    valid: boolean = false;

    constructor(protected messageId : number, buffer? : Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }

    abstract serialize(): Buffer;

    abstract deserialize(buffer: Buffer): void;
    
}
