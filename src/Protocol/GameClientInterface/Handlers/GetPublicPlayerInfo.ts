
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { GetPublicPlayerInfo } from "../Messages/GetPublicPlayerInfo";
import UserModel, { IUser } from "../../../Models/User.model";

export class GetPublicPlayerInfoHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : GetPublicPlayerInfo = new GetPublicPlayerInfo(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            UserModel.findById(message.id).select({username: 1, avatarUri: 1, rank: 1}).exec( (err, user : IUser) => {
                if (err) console.error(err);

                let response : GetPublicPlayerInfo = new GetPublicPlayerInfo(this.messageId);
                response.id = user.id;
                response.username = user.username;
                response.avatarUri = user.avatarUri;
                response.diceUri = "";
                response.rank = user.rank;

                myClient.write(response.serialize());
            });
            return true;
        } else {
            return false;
        }
    }
    
}
