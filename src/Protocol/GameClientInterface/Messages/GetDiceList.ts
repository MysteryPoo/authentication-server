
import { MessageBase } from "../../../Abstracts/MessageBase";
import { IDice } from "../../../Models/Dice.model";
import { BufferHelper } from "../../../BufferHelper";

export class GetDiceList extends MessageBase {

    public ownedDiceList : Array<IDice> = [];
    public unownedDiceList : Array<IDice> = [];

    serialize(): Buffer {
        let idLength : number = 0;
        let uriLength : number = 0;
        for(let i = 0; i < this.ownedDiceList.length; ++i) {
            idLength += Buffer.byteLength(this.ownedDiceList[i].id, 'utf8');
            uriLength += Buffer.byteLength(this.ownedDiceList[i].uri, 'utf8');
        }
        for(let i = 0; i < this.unownedDiceList.length; ++i) {
            idLength += Buffer.byteLength(this.unownedDiceList[i].id, 'utf8');
            uriLength += Buffer.byteLength(this.unownedDiceList[i].uri, 'utf8');
        }

        // Known header size is 7, plus the length of all the IDs and URIs, plus a 2-byte header for each owned avatar, plus 11-byte header for each unowned
        let bufferSize : number =  7 + idLength + uriLength + this.ownedDiceList.length * 2 + this.unownedDiceList.length * 11;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        // Header
        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        // Owned Avatars
        helper.writeUInt8(this.ownedDiceList.length);
        for (let dice of this.ownedDiceList) {
            let idLength : number = Buffer.byteLength(dice.id, 'utf-8');
            let uriLength : number = Buffer.byteLength(dice.uri, 'utf-8');

            helper.writeUInt8(idLength);
            helper.writeString(dice.id);
            helper.writeUInt8(uriLength);
            helper.writeString(dice.uri);
        }
        // Unowned Avatars
        helper.writeUInt8(this.unownedDiceList.length);
        for (let dice of this.unownedDiceList) {
            let idLength : number = Buffer.byteLength(dice.id, 'utf-8');
            let uriLength : number = Buffer.byteLength(dice.uri, 'utf-8');

            helper.writeUInt8(idLength);
            helper.writeString(dice.id);
            helper.writeUInt8(uriLength);
            helper.writeString(dice.uri);
            helper.writeUInt8(dice.requiredLevel);
            helper.writeUInt32LE(dice.creditCost);
            helper.writeUInt32LE(dice.premiumCost);
        }

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
