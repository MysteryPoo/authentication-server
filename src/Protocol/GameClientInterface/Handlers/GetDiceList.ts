
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import UserModel, { IUser } from "../../../Models/User.model";
import DiceModel, { IDice } from "../../../Models/Dice.model";
import { GetDiceList } from "../Messages/GetDiceList";
import { ObjectId } from "mongodb";

export class GetDiceListHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        if (myClient.authenticated) {
            UserModel.findById(myClient.uid).select({diceList : 1}).exec( (err, user : IUser) => {
                if (err) console.error(err);

                DiceModel.find().exec( (err, diceList : Array<IDice>) => {
                    if (err) console.error(err);

                    let response : GetDiceList = new GetDiceList(this.messageId);

                    for (let dice of diceList) {
                        let found : ObjectId | undefined = user.diceList.find( (element) => {
                            return element.toHexString() === dice.id;
                        });

                        if(found) {
                            response.ownedDiceList.push(dice);
                        } else if (dice.visible) {
                            response.unownedDiceList.push(dice);
                        }
                    }

                    myClient.write(response.serialize());
                    
                });
            });
            return true;
        } else {
            return false;
        }
    }

}
