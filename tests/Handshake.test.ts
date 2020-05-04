
import { expect } from "chai";
import { HandshakeHandler } from "../src/Protocol/GameClientInterface/Handlers/Handshake";
import { Handshake } from "../src/Protocol/GameClientInterface/Messages/Handshake";
import { ServerMock } from "./Mocks/ServerMock";
import { ClientMock } from "./Mocks/ClientMock";
import { ObjectId } from "mongodb";
import { SocketMock } from "./Mocks/SocketMock";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function setupIncomingMessage(good : boolean) : Buffer {
    let incomingMessage : Buffer;
    if(good) {
        let id : ObjectId = new ObjectId();
        let idLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let password : string = crypto.randomBytes(16).toString('utf-8');
        let passLength : number = Buffer.byteLength(password, 'utf-8');
        let device_uuid : string = uuid();
        let uuidLength : number = Buffer.byteLength(device_uuid, 'utf-8');
        //let operatingSystem : string = "";
        let protocolVersion : number = getRandomInt(255);
        let gameVersion : number = getRandomInt(255);

        incomingMessage = Buffer.allocUnsafe(5 + idLength + passLength + uuidLength);
        incomingMessage.writeUInt8(idLength, 0);
        incomingMessage.write(id.toHexString(), 1, idLength, 'utf-8');
        incomingMessage.writeUInt8(passLength, 1 + idLength);
        incomingMessage.write(password, 2 + idLength, passLength, 'utf-8');
        incomingMessage.writeUInt8(uuidLength, 2 + idLength + passLength);
        incomingMessage.write(device_uuid, 3 + idLength + passLength, 'utf-8');
        incomingMessage.writeUInt8(protocolVersion, 3 + idLength + passLength + uuidLength);
        incomingMessage.writeUInt8(gameVersion, 4 + idLength + passLength + uuidLength);
    } else {
        incomingMessage = Buffer.allocUnsafe(32);
    }

    return incomingMessage;
}

describe("Handshake Handler", () => {

    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), [], server);
        let handler : HandshakeHandler = new HandshakeHandler(1);

        expect(handler.handle(setupIncomingMessage(true), myClient)).to.be.true;

        done();
    });

    it("should create a new user", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), [], server);
        let handler : HandshakeHandler = new HandshakeHandler(1);

        let idLength : number = 1, passLength : number = 1, uuidLength : number = 1;

        let incomingMessage = Buffer.allocUnsafe(5 + idLength + passLength + uuidLength);
        incomingMessage.writeUInt8(idLength, 0);
        incomingMessage.write("0", 1, idLength, 'utf-8');
        incomingMessage.writeUInt8(passLength, 1 + idLength);
        incomingMessage.write("abc123", 2 + idLength, passLength, 'utf-8');
        incomingMessage.writeUInt8(uuidLength, 2 + idLength + passLength);
        incomingMessage.write("0", 3 + idLength + passLength, 'utf-8');
        incomingMessage.writeUInt8(1, 3 + idLength + passLength + uuidLength);
        incomingMessage.writeUInt8(1, 4 + idLength + passLength + uuidLength);

        expect(handler.handle(incomingMessage, myClient)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), [], server);
        let handler : HandshakeHandler = new HandshakeHandler(1);

        expect(handler.handle(setupIncomingMessage(false), myClient)).to.be.false;

        done();
    });

});

describe("Handshake Message", () => {

    it("should serialize into a valid buffer", (done) => {
        let now = new Date();
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 9;
        let id : ObjectId = new ObjectId();
        let idLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let device_uuid : string = uuid();
        let uuidLength : number = Buffer.byteLength(device_uuid, 'utf-8');
        let username : string = "Test Username";
        let usernameLength : number = Buffer.byteLength(username, 'utf-8');
        let lastLogin : string = now.toString();
        let lastLoginLength : number = Buffer.byteLength(lastLogin, 'utf-8');

        let bufferSize = expectedSize + idLength + uuidLength + usernameLength + lastLoginLength;
        let truth = Buffer.allocUnsafe(bufferSize);
        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(bufferSize, 1);
        truth.writeUInt8(idLength, 5);
        truth.write(id.toHexString(), 6, idLength, 'utf8');
        truth.writeUInt8(uuidLength, 6 + idLength);
        truth.write(device_uuid, 7 + idLength, uuidLength, 'utf8');
        truth.writeUInt8(usernameLength, 7 + idLength + uuidLength);
        truth.write(username, 8 + idLength + uuidLength, usernameLength, 'utf8');
        truth.writeUInt8(lastLoginLength, 8 + idLength + uuidLength + usernameLength);
        truth.write(lastLogin, 9 + idLength + uuidLength + usernameLength, lastLoginLength, 'utf8');

        // Instatiate test instance
        let hs : Handshake = new Handshake(messageId);
        hs.id = id.toHexString();
        hs.device_uuid = device_uuid;
        hs.username = username;
        hs.lastLogin = now;
        
        let buffer : Buffer = hs.serialize();
        
        expect(buffer.equals(truth)).to.be.true;

        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : ObjectId = new ObjectId();
        let idLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let password : string = crypto.randomBytes(16).toString('utf-8');
        let passLength : number = Buffer.byteLength(password, 'utf-8');
        let device_uuid : string = uuid();
        let uuidLength : number = Buffer.byteLength(device_uuid, 'utf-8');
        //let operatingSystem : string = "";
        let protocolVersion : number = getRandomInt(255);
        let gameVersion : number = getRandomInt(255);

        let truth = Buffer.allocUnsafe(5 + idLength + passLength + uuidLength);
        truth.writeUInt8(idLength, 0);
        truth.write(id.toHexString(), 1, idLength, 'utf-8');
        truth.writeUInt8(passLength, 1 + idLength);
        truth.write(password, 2 + idLength, passLength, 'utf-8');
        truth.writeUInt8(uuidLength, 2 + idLength + passLength);
        truth.write(device_uuid, 3 + idLength + passLength, 'utf-8');
        truth.writeUInt8(protocolVersion, 3 + idLength + passLength + uuidLength);
        truth.writeUInt8(gameVersion, 4 + idLength + passLength + uuidLength);

        let hs : Handshake = new Handshake(1);
        expect(hs.valid).to.be.false;

        hs.deserialize(truth);
        expect(hs.valid).to.be.true;

        expect(hs.id === id.toHexString());
        expect(hs.password === password);
        expect(hs.device_uuid === device_uuid);
        expect(hs.protocolVersion === protocolVersion);
        expect(hs.gameVersion === gameVersion);
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let hs : Handshake = new Handshake(1, lie);

        expect(hs.valid).to.be.false;

        done();
    });

});
