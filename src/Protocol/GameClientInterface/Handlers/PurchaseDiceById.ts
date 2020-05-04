
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { PurchaseDiceById } from "../Messages/PurchaseDiceById";
import DiceModel, { IDice } from "../../../Models/Dice.model";
import UserModel, { IUser } from "../../../Models/User.model";
import { MESSAGE_ID } from "../../../UserServerManager";
import { GetDashboardHandler } from "./GetDashboard";

export class PurchaseDiceByIdHandler extends MessageHandlerBase {

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : PurchaseDiceById = new PurchaseDiceById(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            DiceModel.findById(message.id).exec( (err, dice : IDice) => {
                if (err) console.error(err);

                UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                    if (err) console.error(err);

                    let message : string = "";

                    if(user.level >= dice.requiredLevel) {
                        if(user.credits >= dice.creditCost) {
                            if(user.premium >= dice.premiumCost) {
                                message = "Dice Acquired.";
                                user.credits -= dice.creditCost;
                                user.premium -= dice.premiumCost;

                                user.diceList.push(dice.id);

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

                    let response : PurchaseDiceById = new PurchaseDiceById(this.messageId);
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
