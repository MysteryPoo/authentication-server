
export abstract class MessageBase {

    constructor(protected messageId : number, protected buffer?: Buffer) {

        if(buffer) {
            this.deserialize(buffer);
        }
    }

    abstract serialize() : Buffer;
    abstract deserialize(buffer : Buffer) : void;
}
