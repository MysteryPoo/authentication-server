
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { PurchaseDiceById } from "../Messages/PurchaseDiceById";

export class PurchaseDiceByIdHandler extends MessageHandlerBase {

    public handle(buffer : Buffer, myClient : IClient): boolean {
        let message : PurchaseDiceById = new PurchaseDiceById(this.messageId, buffer);

        if (message.valid) {
            // TODO : Implement this
            return true;
        } else {
            return false;
        }
    }
    
}
