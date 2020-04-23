
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class FriendRequest extends MessageBase {

    public id! : string;
    public addFlag! : boolean; // If false, remove

    serialize(): Buffer {
        // TODO : Add a response whether the request was successful or not
        throw new Error("Method not implemented.");
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);
            let idLength : number = helper.readUInt8();

            this.validate(buffer, 2 + idLength);

            this.id = helper.readString(idLength);
            this.addFlag = helper.readUInt8() === 0 ? false : true;

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
