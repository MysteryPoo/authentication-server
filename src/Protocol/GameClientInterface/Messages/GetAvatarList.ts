
import { MessageBase } from "../../../Abstracts/MessageBase";
import { IAvatar } from "../../../Models/Avatar.model";
import { BufferHelper } from "../../../BufferHelper";

export class GetAvatarList extends MessageBase {

    public ownedAvatarList : Array<IAvatar> = [];
    public unownedAvatarList : Array<IAvatar> = [];

    serialize(): Buffer {
        let idLength : number = 0;
        let uriLength : number = 0;
        for(let i = 0; i < this.ownedAvatarList.length; ++i) {
            idLength += Buffer.byteLength(this.ownedAvatarList[i].id, 'utf8');
            uriLength += Buffer.byteLength(this.ownedAvatarList[i].uri, 'utf8');
        }
        for(let i = 0; i < this.unownedAvatarList.length; ++i) {
            idLength += Buffer.byteLength(this.unownedAvatarList[i].id, 'utf8');
            uriLength += Buffer.byteLength(this.unownedAvatarList[i].uri, 'utf8');
        }

        // Known header size is 7, plus the length of all the IDs and URIs, plus a 2-byte header for each owned avatar, plus 11-byte header for each unowned
        let bufferSize : number =  7 + idLength + uriLength + this.ownedAvatarList.length * 2 + this.unownedAvatarList.length * 11;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        // Header
        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        // Owned Avatars
        helper.writeUInt8(this.ownedAvatarList.length);
        for (let avatar of this.ownedAvatarList) {
            let idLength : number = Buffer.byteLength(avatar.id, 'utf-8');
            let uriLength : number = Buffer.byteLength(avatar.uri, 'utf-8');

            helper.writeUInt8(idLength);
            helper.writeString(avatar.id);
            helper.writeUInt8(uriLength);
            helper.writeString(avatar.uri);
        }
        // Unowned Avatars
        helper.writeUInt8(this.unownedAvatarList.length);
        for (let avatar of this.unownedAvatarList) {
            let idLength : number = Buffer.byteLength(avatar.id, 'utf-8');
            let uriLength : number = Buffer.byteLength(avatar.uri, 'utf-8');

            helper.writeUInt8(idLength);
            helper.writeString(avatar.id);
            helper.writeUInt8(uriLength);
            helper.writeString(avatar.uri);
            helper.writeUInt8(avatar.requiredLevel);
            helper.writeUInt32LE(avatar.creditCost);
            helper.writeUInt32LE(avatar.premiumCost);
        }

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
