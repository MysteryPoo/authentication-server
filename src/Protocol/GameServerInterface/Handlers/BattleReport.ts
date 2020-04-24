
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { BattleReport } from "../Messages/BattleReport";
import BattleReportModel, { IBattleReport } from "../../../Models/BattleReport.model";
import { ObjectId } from "mongodb";
import { IGameServer } from "../../../Interfaces/IGameServer";

export class BattleReportHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IGameServer): boolean {
        let message : BattleReport = new BattleReport(this.messageId, buffer);

        if (message.valid) {
            BattleReportModel.create({
                winnerId : new ObjectId(message.winnerId),
                playerList : message.playerList
            });
            /*let BR : IBattleReport = new BattleReportModel({

            });*/
            return true;
        } else {
            return false;
        }
    }

}
