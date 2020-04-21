
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { PurchaseAvatarById } from "../Messages/PurchaseAvatarById";

export class PurchaseAvatarByIdHandler extends MessageHandlerBase {

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : PurchaseAvatarById = new PurchaseAvatarById(this.messageId, buffer);

        if (message.valid) {
            // TODO : Implement this
            return true;
        } else {
            return false;
        }
    }
    
}
