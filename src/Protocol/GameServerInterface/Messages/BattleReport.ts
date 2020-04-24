
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

class PlayerData {
    constructor(public id : string, public score : number, public trophyList : Array<number>) {

    }
}

export class BattleReport extends MessageBase {

    public winnerId! : string;
    public playerList! : Array<PlayerData>;

    serialize(): Buffer {
        throw new Error("Method not implemented.");
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            let winnerIdLength : number = helper.readUInt8();
            this.winnerId = helper.readString(winnerIdLength);

            let numPlayers : number = helper.readUInt8();
            for (let p = 0; p < numPlayers; ++p) {
                let idLength : number = helper.readUInt8();
                let id : string = helper.readString(idLength);
                let score : number = helper.readUInt32LE();
                let numTrophies : number = helper.readUInt8();
                let trophies = [];
                for (let t = 0; t < numTrophies; ++t) {
                    trophies[t] = helper.readUInt8();
                }
                this.playerList.push(new PlayerData(id, score, trophies));
            }

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
