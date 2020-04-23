
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { FriendRequest } from "../Messages/FriendRequest";
import UserModel, { IUser } from "../../../Models/User.model";
import { ObjectId } from "mongodb";

export class FriendRequestHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : FriendRequest = new FriendRequest(this.messageId, buffer);

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
                    });
                }
            });
            return true;
        } else {
            return false;
        }
    }

}
