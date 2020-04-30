
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import UserModel, { IUser } from "../../../Models/User.model";
import MessageModel, { IMessage } from "../../../Models/Message.model";
import { MessageInfo } from "../Messages/MessageInfo";
import { MESSAGE_ID } from "../../../UserServer";

export class GetMessagesHandler extends MessageHandlerBase {

    handle(buffer: Buffer, mySocket: IClient): boolean {
        if (mySocket.authenticated) {
            UserModel.findById(mySocket.uid).exec( (err, user : IUser) => {
                if (err) console.error(err);

                MessageModel.find({_id: {$in: user.messageList}}).exec( (err, messageList : IMessage[]) =>{
                    for (let message of messageList) {
                        let response : MessageInfo = new MessageInfo(MESSAGE_ID.MessageInfo);
                        response.id = message.id;
                        response.sender = message.sender.toHexString();
                        response.senderName = message.senderName;
                        response.subject = message.subject;
                        response.message = message.message;
                        response.isNew = message.isUnread;

                        mySocket.write(response.serialize());
                    }
                });
            });
            return true;
        } else {
            return false;
        }
    }

}
