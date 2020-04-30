
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { SetMessageState } from "../Messages/SetMessageState";
import MessageModel, { IMessage } from "../../../Models/Message.model";
import UserModel, { IUser } from "../../../Models/User.model";
import { IClient } from "../../../Interfaces/IClient";

export class SetMessageStateHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SetMessageState = new SetMessageState(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            if (message.setRead) {
                MessageModel.findById(message.id).exec( (err, message : IMessage) => {
                    if (err) console.error(err);

                    message.isUnread = false;

                    message.save();
                });
            }
            if (message.setArchive) {
                UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                    if (err) console.error(err);

                    let index = user.messageList.findIndex( (element) => {
                        return element.toHexString() === message.id;
                    });

                    user.messageList.splice(index, 1);

                    user.save();
                });
            }
            return true;
        } else {
            return false;
        }
    }

}
