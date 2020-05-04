
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Handshake } from "../Messages/Handshake";
import { ObjectId } from "mongodb";
import UserModel, { IUser } from "../../../Models/User.model";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { UserServerManager } from "../../../UserServerManager";
import { IUserClient } from "../../../Interfaces/IUserClient";
import MessageModel, { IMessage } from "../../../Models/Message.model";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IUserClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);
        let disconnect = false;

        if (message.valid && !myClient.authenticated) {
            if (message.id === "0") {
                // New User
                new UserModel({
                    id: new ObjectId(),
                    username: "NewUser_" + uuid(),
                    password: message.password,
                    salt: crypto.randomBytes(4).toString('hex')
                }).save().then( (user : IUser) => {
                    let response : Handshake = new Handshake(this.messageId);
                    response.id = user.id;
                    response.username = user.username;
                    response.device_uuid = user.device_uuid;
                    response.lastLogin = new Date();

                    myClient.gameVersion = message.gameVersion;

                    user.password = crypto.createHmac('sha1', user.salt).update(user.password).digest('hex');
                    new MessageModel({
                        sender: user.id,
                        senderName: "System",
                        isUnread: true,
                        recipient: user.id,
                        subject: "Welcome!",
                        message: "Welcome to Farkle in Space!\nHave fun!!!"
                    }).save().then( (message : IMessage) => {
                        user.messageList.push(message.id);
                        user.save();
                    });

                    let server : UserServerManager = myClient.connectionManager as UserServerManager;
                    server.authenticateClient(user.id, myClient);
                    myClient.uid = user.id;

                    myClient.write(response.serialize());
                }).catch( err => {
                    let response : Handshake = new Handshake(this.messageId);
                    response.id = "0";
                    response.device_uuid = "0";
                    response.username = err.toString();
                    response.lastLogin = new Date(0);
                    myClient.write(response.serialize());

                    disconnect = true;
                });
            } else {
                try {
                    let dbId : ObjectId = new ObjectId(message.id);
                    UserModel.findById(dbId).exec( (err, user : IUser) => {
                        if (err) console.error(err);

                        let passHash = crypto.createHmac('sha1', user.salt).update(message.password).digest('hex');

                        let response : Handshake = new Handshake(this.messageId);
                        if (user.password === passHash) {
                            response.id = user.id;
                            response.username = user.username;
                            response.device_uuid = user.device_uuid;
                            response.lastLogin = user.last_login;
                            
                            myClient.gameVersion = message.gameVersion;

                            user.last_login = new Date();
                            user.save();

                            let server : UserServerManager = myClient.connectionManager as UserServerManager;
                            server.authenticateClient(user.id, myClient);
                            myClient.uid = user.id;
                        } else {
                            response.id = "0";
                            response.username = "Invalid password.";
                            response.device_uuid = "0";
                            response.lastLogin = new Date(0);

                            disconnect = true;
                        }

                        myClient.write(response.serialize());
                        
                    });
                } catch (e) {
                    console.debug(message);
                    console.error(e);
                    disconnect = true;
                }
            }
        } else {
            disconnect = true;
        }

        if (disconnect) {
            myClient.connectionManager.handleDisconnect(myClient);
            return false;
        }

        return true;
    }

}
