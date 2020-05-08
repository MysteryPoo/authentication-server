
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import UserModel, { IUser } from "../../../Models/User.model";
import AwardModel, { IAward } from "../../../Models/Award.model";
import { GetNextAward } from "../Messages/GetNextAward";

export class GetNextAwardHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        if (myClient.authenticated) {
            UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                if (user.pendingAwards.length > 0) {
                    AwardModel.findById(user.pendingAwards[0]).exec( (err, award : IAward) => {
                        let response : GetNextAward = new GetNextAward(this.messageId);
                        response.credits = award.credits;
                        response.premium = award.premium;
                        //response.conquest = award.conquest;
                        response.experience = award.experience;
                        if (award.avatar) {
                            response.avatarId = award.avatar.avatarId.toHexString();
                            response.avatarUri = award.avatar.avatarUri;
                        } else {
                            response.avatarId = "0";
                            response.avatarUri = "0";
                        }
                        
                        myClient.write(response.serialize());

                        user.credits += award.credits;
                        user.premium += award.premium;
                        user.conquest += award.conquest;
                        user.experience += award.experience;
                        if (award.avatar) {
                            user.avatarList.push(award.avatar.avatarId);
                        }

                        user.pendingAwards.splice(0, 1);
                        user.save();
                    });
                } else {

                }
            });
            return true;
        } else {
            return false;
        }
    }

}
