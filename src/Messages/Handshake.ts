
import { IMessageBase, IMessageHandler } from "./MessageBase";
import { IServer } from "../Server";
import { Socket } from "net";
import { Client, IClient } from "../Client";
import { ObjectId } from "mongodb";

const size = 0;

export class Handshake implements IMessageBase {

    valid : boolean = false;

    public id : ObjectId = new ObjectId();
    public device_uuid : string = "";
    public username : string = "";
    public passHash : string = "";
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
        let idLength = Buffer.byteLength(this.id.toHexString(), 'utf8');
        let device_uuid = this.device_uuid;
        let device_uuidLength = Buffer.byteLength(device_uuid, 'utf8');
        let username = this.username;
        let usernameLength = Buffer.byteLength(username, 'utf8');
        let lastLogin = this.lastLogin.toString();
        let lastLoginLength = Buffer.byteLength(lastLogin, 'utf8');
        
        let responseSize = 9 + idLength + device_uuidLength + usernameLength + lastLoginLength;
        let response = Buffer.allocUnsafe(responseSize);
        let bufferTell = 0;
        
        response.writeUInt8(this.messageId, bufferTell); bufferTell += 1;
        response.writeUInt32LE(responseSize, bufferTell); bufferTell += 4;
        response.writeUInt8(idLength, bufferTell); bufferTell += 1;
        response.write(this.id.toHexString(), bufferTell, idLength, 'utf8'); bufferTell += idLength;
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
            let hashLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            let hash = buffer.toString('utf8', bufferTell, bufferTell + hashLength); bufferTell += hashLength;
            let uuidDeviceLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            let uuidDevice = buffer.toString('utf8', bufferTell, bufferTell + uuidDeviceLength); bufferTell += uuidDeviceLength;
            //let osLength = buffer.readUInt8(bufferTell); bufferTell += 1;
            //let os = buffer.toString('utf8', bufferTell, bufferTell + osLength); bufferTell += osLength;
            let protocolVersion = buffer.readUInt8(bufferTell); bufferTell += 1;
            let gameVersion = buffer.readUInt8(bufferTell); bufferTell += 1;

            const bufferSize = 5 + idLength + hashLength + uuidDeviceLength;

            if(buffer.length != bufferSize) {
                throw `Incorrect buffer size. Expected ${bufferSize}, but got ${buffer.length}`;
            }
            
            this.id = new ObjectId(id);
            this.passHash = hash;
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
