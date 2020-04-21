
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { AddRemoveFriend } from "../Messages/AddRemoveFriend";

export class AddRemoveFriendHandler extends MessageHandlerBase {

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : AddRemoveFriend = new AddRemoveFriend(this.messageId, buffer);

        if (message.valid) {
            // TODO : Implement this
            return true;
        } else {
            return false;
        }
    }
    
}
