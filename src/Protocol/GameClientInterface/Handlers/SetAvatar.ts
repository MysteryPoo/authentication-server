
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { SetAvatar } from "../Messages/SetAvatar";
import UserModel, { IUser } from "../../../Models/User.model";
import { ObjectId } from "mongodb";
import AvatarModel, { IAvatar } from "../../../Models/Avatar.model";
import { GetPublicPlayerInfo } from "../Messages/GetPublicPlayerInfo";
import { MESSAGE_ID, UserServer } from "../../../UserServer";
import { ILobby } from "../../../Interfaces/ILobby";

export class SetAvatarHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SetAvatar = new SetAvatar(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                if (err) console.error(err);

                let avatarId : ObjectId | undefined = user.avatarList.find( (element) => {
                    return element.toHexString() === message.id;
                });

                if (avatarId) {
                    AvatarModel.findById(avatarId).exec( (err, avatar : IAvatar) => {
                        if (err) console.error(err);

                        user.avatarUri = avatar.uri;

                        user.save();

                        let response : GetPublicPlayerInfo = new GetPublicPlayerInfo(MESSAGE_ID.GetPublicPlayerInfo);
                        response.id = user.id;
                        response.avatarUri = avatar.uri;
                        response.diceUri = user.diceUri;
                        response.rank = user.rank;
                        response.username = user.username;

                        let responseBuffer : Buffer = response.serialize();

                        myClient.write(responseBuffer);

                        let myServer : UserServer = this.serverRef as UserServer;
                        // Notify Friends
                        for (let friend of user.friendList) {
                            let client : IClient | undefined = myServer.getClientById(friend.toHexString());
                            if (client) {
                                client.write(responseBuffer);
                            }
                        }
                        // Notify Lobby
                        let lobby : ILobby | undefined = myServer.lobbyMgr.getLobbyOfClient(myClient);
                        if (lobby) {
                            for (let client of lobby.clientList) {
                                client.write(responseBuffer);
                            }
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
