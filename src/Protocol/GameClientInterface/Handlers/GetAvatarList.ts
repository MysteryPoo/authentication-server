
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import UserModel, { IUser } from "../../../Models/User.model";
import AvatarModel, { IAvatar } from "../../../Models/Avatar.model";
import { GetAvatarList } from "../Messages/GetAvatarList";
import { ObjectId } from "mongodb";

export class GetAvatarListHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        if (myClient.authenticated) {
            UserModel.findById(myClient.uid).select({avatarList : 1}).exec( (err, user : IUser) => {
                if (err) console.error(err);

                AvatarModel.find().exec( (err, avatarList : Array<IAvatar>) => {
                    if (err) console.error(err);

                    let response : GetAvatarList = new GetAvatarList(this.messageId);

                    for (let avatar of avatarList) {
                        let found : ObjectId | undefined = user.avatarList.find( (element) => {
                            return element.toHexString() === avatar.id;
                        });

                        if(found) {
                            response.ownedAvatarList.push(avatar);
                        } else if (avatar.visible) {
                            response.unownedAvatarList.push(avatar);
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
