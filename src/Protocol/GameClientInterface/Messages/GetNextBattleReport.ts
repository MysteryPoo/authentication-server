
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class PlayerData {
    constructor(public id : string, public score : number) {

    }
}

export class GetNextBattleReport extends MessageBase {

    winnerId! : string;
    playerList : Array<PlayerData> = [];
    trophyList : Array<number> = [];

    serialize(): Buffer {
        let winnerIdLength : number = Buffer.byteLength(this.winnerId, 'utf-8');
        let playerListIdLength : number = 0;
        for (let player of this.playerList) {
            playerListIdLength += Buffer.byteLength(player.id, 'utf-8');
        }

        let bufferSize : number = 8 + winnerIdLength + playerListIdLength + this.playerList.length * 3 + this.trophyList.length;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));
        
        // Header
        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        // Data
        helper.writeUInt8(winnerIdLength);
        helper.writeString(this.winnerId);
        helper.writeUInt8(this.playerList.length);
        for (let player of this.playerList) {
            let idLength : number = Buffer.byteLength(player.id, 'utf-8');
            helper.writeUInt8(idLength);
            helper.writeString(player.id);
            helper.writeUInt16LE(player.score);
        }
        helper.writeUInt8(this.trophyList.length);
        for (let trophy of this.trophyList) {
            helper.writeUInt8(trophy);
        }

        console.debug(this);
        console.debug(helper.buffer);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
