
import { IMessageBase, IMessageHandler } from "./MessageBase";
import { IServer } from "../Server";
import { IClient } from "../Client";
import UserModel, { IUser } from "../Models/User.model";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export class Handshake implements IMessageBase {

    valid : boolean = false;

    public id : string = "";
    public device_uuid : string = "";
    public username : string = "";
    public password : string = "";
    public salt : string = "";
    public lastLogin : Date = new Date();
    public operatingSystem : string = "";
    public protocolVersion : number = 0;
    public gameVersion : number = 0;

    constructor(protected messageId : number, buffer? : Buffer) {
        if (buffer) {
            this.deserialize(buffer);
        }
    }

    serialize() : Buffer {
        // TODO : Clean this up
        let idLength : number = Buffer.byteLength(this.id, 'utf8');
        let device_uuid : string = this.device_uuid;
        let device_uuidLength : number = Buffer.byteLength(device_uuid, 'utf8');
        let username :string = this.username;
        let usernameLength : number = Buffer.byteLength(username, 'utf8');
        let lastLogin : string = this.lastLogin.getTime() === new Date(0).getTime() ? "0" : this.lastLogin.toString();
        let lastLoginLength : number = Buffer.byteLength(lastLogin, 'utf8');

        let responseSize = 9 + idLength + device_uuidLength + usernameLength + lastLoginLength;
        let response = Buffer.allocUnsafe(responseSize);
        let bufferTell = 0;
        
        response.writeUInt8(this.messageId, bufferTell); bufferTell += 1;
        response.writeUInt32LE(responseSize, bufferTell); bufferTell += 4;
        response.writeUInt8(idLength, bufferTell); bufferTell += 1;
        response.write(this.id, bufferTell, idLength, 'utf8'); bufferTell += idLength;
        response.writeUInt8(device_uuidLength, bufferTell); bufferTell += 1;
        response.write(device_uuid, bufferTell, device_uuidLength, 'utf8'); bufferTell += device_uuidLength;
        response.writeUInt8(usernameLength, bufferTell); bufferTell += 1;
        response.write(username, bufferTell, usernameLength, 'utf8'); bufferTell += usernameLength;
        response.writeUInt8(lastLoginLength, bufferTell); bufferTell += 1;
        response.write(lastLogin, bufferTell, lastLoginLength, 'utf8'); bufferTell += lastLoginLength;
        
        return response;
    }

    deserialize(buffer : Buffer) : void {
        // TODO : Clean this up
        try {
            let bufferTell = 0;
	
            let idLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            let id = buffer.toString('utf8', bufferTell, bufferTell + idLength); bufferTell += idLength;
            let passLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            let password = buffer.toString('utf8', bufferTell, bufferTell + passLength); bufferTell += passLength;
            let uuidDeviceLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            let uuidDevice = buffer.toString('utf8', bufferTell, bufferTell + uuidDeviceLength); bufferTell += uuidDeviceLength;
            //let osLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            //let os = buffer.toString('utf8', bufferTell, bufferTell + osLength); bufferTell += osLength;
            let protocolVersion = buffer.readUInt8(bufferTell); bufferTell += 1;
            let gameVersion = buffer.readUInt8(bufferTell); bufferTell += 1;

            const bufferSize = 5 + idLength + passLength + uuidDeviceLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }
            
            this.id = id;
            this.password = password;
            this.device_uuid = uuidDevice;
            //this.operatingSystem = os;
            this.protocolVersion = protocolVersion;
            this.gameVersion = gameVersion;

            this.valid = true;
        } catch (e) {
            console.error(e);
            this.valid = false;
        }
    }
}

export class HandshakeHandler implements IMessageHandler {
    
    constructor(readonly serverRef: IServer, readonly messageId: number) {

    }

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);

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

                    user.password = crypto.createHmac('sha1', user.salt).update(user.password).digest('hex');
                    user.save();

                    myClient.write(response.serialize());
                }).catch( err => {
                    let response : Handshake = new Handshake(this.messageId);
                    response.id = "0";
                    response.device_uuid = "0";
                    response.username = err.toString();
                    response.lastLogin = new Date(0);
                    myClient.write(response.serialize());

                    let index = this.serverRef.socketList.findIndex( (element) => {
                        return element.uid === myClient.uid;
                    });
                    if (index != -1) {
                        this.serverRef.socketList.splice(index, 1);
                    }
                    myClient.destroy();
                });
            } else {
                let dbId = new ObjectId(message.id);
                UserModel.findById(dbId).exec( (err, user : IUser) => {
                    if (err) console.error(err);

                    let passHash = crypto.createHmac('sha1', user.salt).update(message.password).digest('hex');

                    let response : Handshake = new Handshake(this.messageId);
                    if (user.password === passHash) {
                        response.id = user.id;
                        response.username = user.username;
                        response.device_uuid = user.device_uuid;
                        response.lastLogin = user.last_login;

                        myClient.authenticated = true;

                        user.last_login = new Date();
                        user.save();
                    } else {
                        response.id = "0";
                        response.username = "Invalid password.";
                        response.device_uuid = "0";
                        response.lastLogin = new Date(0);
                    }

                    myClient.write(response.serialize());
                    
                });
            }
            return true;
        } else {
            let index = this.serverRef.socketList.findIndex( (element) => {
                return element.uid === myClient.uid;
            });
            if (index != -1) {
                this.serverRef.socketList.splice(index, 1);
            }
            return false;
        }
    }


}
