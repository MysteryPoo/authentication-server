
import { MessageBase } from "../Common/MessageBase";

export class NewLobby extends MessageBase {

    public isPublic : boolean = false;
    public maxPlayers : number  = 0;

    serialize(): Buffer {
        throw new Error("Method not implemented.");
    }

    deserialize(buffer: Buffer): void {
        try {
            this.validate(buffer, 2);

            this.isPublic = buffer.readUInt8(0) === 0 ? false : true;
            this.maxPlayers = buffer.readUInt8(1);

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
