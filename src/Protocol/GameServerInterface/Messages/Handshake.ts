
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class Handshake extends MessageBase {

    public gameVersion!: number;
    public gameServerPassword!: string;
    public playerIdList!: Array<string>;

    serialize(): Buffer {
        throw new Error("Method not implemented.");
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);
            this.gameVersion = helper.readUInt8();
            
            let passLength : number = helper.readUInt8();
            this.gameServerPassword = helper.readString(passLength);

            let numPlayers : number = helper.readUInt8();
            for (let p = 0; p < numPlayers; ++p) {
                let idLength : number = helper.readUInt8();
                this.playerIdList.push(helper.readString(idLength));
            }

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
