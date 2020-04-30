
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { MessageInfo } from "../Messages/MessageInfo";
import MessageModel, { IMessage } from "../../../Models/Message.model";
import UserModel, { IUser } from "../../../Models/User.model";
import { UserServer } from "../../../UserServer";

export class MessageInfoHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : MessageInfo = new MessageInfo(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            UserModel.findById(message.recipient).exec( (err, recipient : IUser) => {
                if (err) console.error(err);
                else {
                    UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                        if (err) console.error(err);
                        new MessageModel({
                            sender: user.id,
                            senderName: user.username,
                            isUnread: true,
                            recipient: message.recipient,
                            subject: message.subject,
                            message: message.message
                        }).save().then( (newMessage : IMessage) => {
                            recipient.messageList.push(newMessage.id);
                            recipient.save();

                            let recipientClient : IClient | undefined = (this.serverRef as UserServer).getClientById(message.recipient);
                            if (recipientClient) {
                                let notification : MessageInfo = new MessageInfo(this.messageId);
                                notification.id = newMessage.id;
                                notification.isNew = newMessage.isUnread;
                                notification.sender = newMessage.sender.toHexString();
                                notification.senderName = newMessage.senderName;
                                notification.subject = newMessage.subject;
                                notification.message = newMessage.message;
                                recipientClient.write(notification.serialize());
                            }
                        });
                    });
                }
            });
            
            return true;
        } else {
            return false;
        }
    }

}
