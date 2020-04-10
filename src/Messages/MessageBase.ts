
export abstract class MessageBase {

    constructor(protected messageId : number, protected buffer?: Buffer) {

        // This currently doesn't work because member variables are initialized after the constructor for some reason
        if(buffer) {
            this.deserialize(buffer);
        }
    }

    abstract serialize() : Buffer;
    abstract deserialize(buffer : Buffer) : void;
}

export interface IMessageBase {

    serialize() : Buffer;
    deserialize(buffer : Buffer) : void;
    
}
