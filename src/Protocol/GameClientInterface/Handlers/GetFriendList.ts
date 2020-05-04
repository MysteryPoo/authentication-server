
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { GetFriendList } from "../Messages/GetFriendList";
import UserModel, { IUser } from "../../../Models/User.model";
import { UserServerManager } from "../../../UserServerManager";

export class GetFriendListHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        if (myClient.authenticated) {
            UserModel.findById(myClient.uid).select({friendList : 1}).exec( (err, user : IUser) => {
                if (err) console.error(err);
                UserModel.find({ _id: {$in: user.friendList}}).exec( (err, friends : Array<IUser>) => {
                    if (err) console.error(err);

                    let myServer: UserServerManager = myClient.connectionManager as UserServerManager;
                    for (let friend of friends) {
                        let online : boolean = myServer.getClientById(friend.id) ? true : false;

                        let friendInfo : GetFriendList = new GetFriendList(this.messageId);
                        friendInfo.id = friend.id;
                        friendInfo.online = online;
                        friendInfo.removeFromClient = false;
                        friendInfo.username = friend.username;

                        myClient.write(friendInfo.serialize());

                    }
                })
            });
            return true;
        } else {
            return false;
        }
    }

}
