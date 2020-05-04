
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { SetDice } from "../Messages/SetDice";
import UserModel, { IUser } from "../../../Models/User.model";
import { ObjectId } from "mongodb";
import DiceModel, { IDice } from "../../../Models/Dice.model";
import { GetPublicPlayerInfo } from "../Messages/GetPublicPlayerInfo";
import { MESSAGE_ID, UserServerManager } from "../../../UserServerManager";
import { ILobby } from "../../../Interfaces/ILobby";

export class SetDiceHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SetDice = new SetDice(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                if (err) console.error(err);

                let diceId : ObjectId | undefined = user.diceList.find( (element) => {
                    return element.toHexString() === message.id;
                });

                if (diceId) {
                    DiceModel.findById(diceId).exec( (err, dice : IDice) => {
                        if (err) console.error(err);

                        user.diceUri = dice.uri;

                        user.save();

                        let response : GetPublicPlayerInfo = new GetPublicPlayerInfo(MESSAGE_ID.GetPublicPlayerInfo);
                        response.id = user.id;
                        response.avatarUri = user.avatarUri;
                        response.diceUri = dice.uri;
                        response.rank = user.rank;
                        response.username = user.username;

                        let responseBuffer : Buffer = response.serialize();

                        myClient.write(responseBuffer);

                        let myServer : UserServerManager = myClient.connectionManager as UserServerManager;
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
