/// TODO : Rename this to SetVisibleUsername
import { IMessageBase } from "../../Interfaces/IMessageBase";
import { IMessageHandler } from "../../Interfaces/IMessageHandler";
import { MESSAGE_ID } from "../../UserServer";
import { IServer } from "../../Interfaces/IServer";
import { IClient } from "../../Interfaces/IClient";
import UserModel, { IUser } from "../../Models/User.model";
import { Handshake } from "./Handshake";

const size = 0;

export class SetVisibleUsername implements IMessageBase {
    
    valid : boolean = false;

    public username : string = "";

    constructor(protected messageId : number, buffer? : Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }

    serialize(): Buffer {
        // TODO : Implement this with an error code for the client to process
        throw new Error("Method not implemented.");
    }
    
    deserialize(buffer: Buffer): void {
        try {
            let usernameLength : number = buffer.readUInt8(0);

            const bufferSize = 1 + usernameLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }
            this.username = buffer.toString('utf8', 1, 1 + usernameLength);

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }

}

export class SetVisibleUsernameHandler implements IMessageHandler {
    
    constructor(readonly serverRef : IServer, readonly messageId : number) {

    }

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SetVisibleUsername = new SetVisibleUsername(this.messageId, buffer);

        if (message.valid) {
            if (myClient.authenticated) {
                UserModel.findById(myClient.uid).exec( (err, user : IUser) => {
                    if (err) console.error(err);

                    user.username = message.username;

                    user.save();

                    let hs : Handshake = new Handshake(MESSAGE_ID.Handshake);
                    hs.id = user.id;
                    hs.username = user.username;
                    hs.device_uuid = user.device_uuid;
                    hs.lastLogin = user.last_login;

                    myClient.write(hs.serialize());
                });
            }
            return true;
        } else {
            return false;
        }
    }

    
}