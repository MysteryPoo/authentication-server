
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { SetVisibleUsername } from "../Messages/SetVisibleUsername";
import UserModel, { IUser } from "../../../Models/User.model";
import { Handshake } from "../Messages/Handshake";
import { MESSAGE_ID } from "../../../UserServerManager";

export class SetVisibleUsernameHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SetVisibleUsername = new SetVisibleUsername(this.messageId, buffer);

        if (message.valid) {
            if (myClient.authenticated) {
                UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                    if (err) console.error(err);
                    // TODO Need some error handling done. Especially for duplicate names
                    user.username = message.username;

                    let response : Handshake = new Handshake(MESSAGE_ID.Handshake);
                    response.id = user.id;
                    response.username = user.username;
                    response.device_uuid = user.device_uuid;
                    response.lastLogin = user.last_login;

                    myClient.write(response.serialize());

                    user.save();
                });
            }
            return true;
        } else {
            return false;
        }
    }

}
