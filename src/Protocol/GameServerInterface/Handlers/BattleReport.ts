
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { BattleReport } from "../Messages/BattleReport";
import BattleReportModel, { IBattleReport } from "../../../Models/BattleReport.model";
import { ObjectId } from "mongodb";
import { IGameServer } from "../../../Interfaces/IGameServer";
import AwardModel, { IAward } from "../../../Models/Award.model";
import UserModel from "../../../Models/User.model";

export class BattleReportHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IGameServer): boolean {
        let message : BattleReport = new BattleReport(this.messageId, buffer);
        if (message.valid) {
            BattleReportModel.create({
                winnerId : new ObjectId(message.winnerId),
                playerList : message.playerList
            }).then( (report : IBattleReport) => {
                for (let player of message.playerList) {
                    UserModel.findOneAndUpdate({_id : player.playerId}, {$push: {pendingBattleReports: report}}).exec();
                }
            });
            new AwardModel({
                credits : 50,
                premium : 0,
                conquest : 0,
                experience : 0
            }).save().then( (award : IAward) => {
                for (let player of message.playerList) {
                    UserModel.findOneAndUpdate({_id : player.playerId}, {$push: {pendingAwards: award}}).exec();
                }
            });
            return true;
        } else {
            return false;
        }
    }

}
