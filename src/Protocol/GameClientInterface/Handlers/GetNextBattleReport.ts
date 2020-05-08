
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import UserModel, { IUser } from "../../../Models/User.model";
import BattleReportModel, { IBattleReport } from "../../../Models/BattleReport.model";
import { GetNextBattleReport, PlayerData } from "../Messages/GetNextBattleReport";

export class GetNextBattleReportHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        if (myClient.authenticated) {
            UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                if (user.pendingBattleReports.length > 0) {
                    BattleReportModel.findById(user.pendingBattleReports[0]).exec( (err, report : IBattleReport) => {
                        let response : GetNextBattleReport = new GetNextBattleReport(this.messageId);
                        response.winnerId = report.winnerId.toHexString();
                        for (let player of report.playerList) {
                            response.playerList.push(new PlayerData(player.playerId.toHexString(), player.score));
                            if (player.playerId.toHexString() === myClient.uid) {
                                for (let trophy of player.trophyList) {
                                    response.trophyList.push(trophy);
                                }
                            }
                        }
                        myClient.write(response.serialize());
                    });
                    user.pendingBattleReports.splice(0, 1);
                    user.save();
                } else {
                    let response : GetNextBattleReport = new GetNextBattleReport(this.messageId);
                    response.winnerId = "0";
                    response.playerList = [];
                    response.trophyList = [];
                    myClient.write(response.serialize());
                }
            });
            return true;
        } else {
            return false;
        }
    }

}
