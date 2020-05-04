
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { PurchaseAvatarById } from "../Messages/PurchaseAvatarById";
import AvatarModel, { IAvatar } from "../../../Models/Avatar.model";
import UserModel, { IUser } from "../../../Models/User.model";
import { MESSAGE_ID } from "../../../UserServerManager";
import { GetDashboardHandler } from "./GetDashboard";

export class PurchaseAvatarByIdHandler extends MessageHandlerBase {

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : PurchaseAvatarById = new PurchaseAvatarById(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            AvatarModel.findById(message.id).exec( (err, avatar : IAvatar) => {
                if (err) console.error(err);

                UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                    if (err) console.error(err);

                    let message : string = "";

                    if(user.level >= avatar.requiredLevel) {
                        if(user.credits >= avatar.creditCost) {
                            if(user.premium >= avatar.premiumCost) {
                                message = "Avatar Acquired.";
                                user.credits -= avatar.creditCost;
                                user.premium -= avatar.premiumCost;

                                user.avatarList.push(avatar.id);

                                user.save();
                            } else {
                                message = "Not enough Rares.";
                            }
                        } else {
                            message = "Not enough Credits.";
                        }
                    } else {
                        message = "Not high enough experience level.";
                    }

                    let response : PurchaseAvatarById = new PurchaseAvatarById(this.messageId);
                    response.message = message;

                    myClient.write(response.serialize());

                    let getDashboard : GetDashboardHandler = new GetDashboardHandler(this.serverRef, MESSAGE_ID.GetDashboard);
                    getDashboard.respond(myClient, user);
                });
            });
            return true;
        } else {
            return false;
        }
    }
    
}
