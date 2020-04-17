
import { Document, Model, model, Types, Schema } from "mongoose";

const PlayerSchema : Schema = new Schema({
    playerId : {type : Schema.Types.ObjectId, required : true},
    score : {type : Number, required : true},
    trophyList : [{type : Number}]
});

const BRSchema : Schema = new Schema({
    winnerId : {type : Schema.Types.ObjectId, required : true},
    playerList : PlayerSchema
});

interface IPlayer extends Document {
    playerId : Types.ObjectId,
    score : number,
    trophyList : Array<number>
}

export interface IBattleReport extends Document {
    winnerId : Types.ObjectId,
    playerList : IPlayer
}

export default model<IBattleReport>('BattleReport', BRSchema);
