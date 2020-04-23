
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { FriendRequest } from "../Messages/FriendRequest";
import UserModel, { IUser } from "../../../Models/User.model";
import { ObjectId } from "mongodb";
import { GetFriendList } from "../Messages/GetFriendList";
import { MESSAGE_ID, UserServer } from "../../../UserServer";

export class FriendRequestHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : FriendRequest = new FriendRequest(this.messageId, buffer);
        // TODO : Refactor this mess
        if (message.valid && myClient.authenticated) {
            UserModel.findById(myClient.uid).select({friendList : 1}).exec( (err, user : IUser) => {
                if (message.addFlag) {
                    let friend : ObjectId | undefined = user.friendList.find( (element) => {
                        return element.toHexString() === message.id;
                    });

                    // Only need to add if not already a friend
                    if (!friend) {
                        UserModel.findById(message.id).select({"_id" : 1, friendList : 1}).exec( (err, friend : IUser) => {
                            user.friendList.push(friend._id);
                            user.save();

                            friend.friendList.push(user._id);
                            friend.save();

                            let myServer : UserServer = this.serverRef as UserServer;
                            let friendClient : IClient | undefined = myServer.getClientById(friend.id);
                            let friendInfo : GetFriendList = new GetFriendList(MESSAGE_ID.GetFriends);
                            friendInfo.id = friend.id;
                            friendInfo.online = friendClient ? true : false;
                            friendInfo.removeFromClient = false;
                            friendInfo.username = friend.username;

                            myClient.write(friendInfo.serialize());

                            if (friendClient) {
                                let otherFriendInfo : GetFriendList = new GetFriendList(MESSAGE_ID.GetFriends);
                                otherFriendInfo.id = user.id;
                                otherFriendInfo.online = true;
                                otherFriendInfo.removeFromClient = false;
                                otherFriendInfo.username = user.username;

                                friendClient.write(otherFriendInfo.serialize());
                            }
                        });
                    }
                } else {
                    // Remove friend
                    UserModel.findById(message.id).select({friendList : 1}).exec( (err, friend : IUser) => {
                        let index : number = user.friendList.findIndex( (element) => {
                            return element.equals(friend._id);
                        });

                        if (index >= 0) {
                            user.friendList.splice(index, 1);
                        }

                        index = friend.friendList.findIndex( (element) => {
                            return element.equals(user._id);
                        });

                        if (index >= 0) {
                            friend.friendList.splice(index, 1);
                        }

                        user.save();
                        friend.save();

                        let myServer : UserServer = this.serverRef as UserServer;
                        let friendClient : IClient | undefined = myServer.getClientById(friend.id);
                        let friendInfo : GetFriendList = new GetFriendList(MESSAGE_ID.GetFriends);
                        friendInfo.id = friend.id;
                        friendInfo.online = friendClient ? true : false;
                        friendInfo.removeFromClient = true;
                        friendInfo.username = friend.username;

                        myClient.write(friendInfo.serialize());

                        if (friendClient) {
                            let otherFriendInfo : GetFriendList = new GetFriendList(MESSAGE_ID.GetFriends);
                            otherFriendInfo.id = user.id;
                            otherFriendInfo.online = true;
                            otherFriendInfo.removeFromClient = true;
                            otherFriendInfo.username = user.username;

                            friendClient.write(otherFriendInfo.serialize());
                        }
                    });
                }
            });
            return true;
        } else {
            return false;
        }
    }

}
