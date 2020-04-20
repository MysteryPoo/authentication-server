
import { MessageBase } from "../../../Abstracts/MessageBase";

export class Handshake extends MessageBase {

    public id! : string;
    public device_uuid! : string;
    public username! : string;
    public password! : string;
    public salt! : string;
    public lastLogin! : Date;
    public operatingSystem! : string;
    public protocolVersion! : number;
    public gameVersion! : number;

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

            this.validate(buffer, bufferSize);
            
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
