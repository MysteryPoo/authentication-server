
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { UserSearch } from "../Messages/UserSearch";
import UserModel, { IUser } from "../../../Models/User.model";

export class UserSearchHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : UserSearch = new UserSearch(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            UserModel.find({username: new RegExp(message.username, 'gi')}).select({_id: 1}).exec( (err, users : Array<IUser>) => {
                let response : UserSearch = new UserSearch(this.messageId);
                response.playerList = users;

                myClient.write(response.serialize());
            });
            return true;
        } else {
            return false;
        }
    }

}
