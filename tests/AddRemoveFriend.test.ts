
import { expect } from "chai";
import { AddRemoveFriend } from "../src/Protocol/GameClientInterface/Messages/AddRemoveFriend";
import { AddRemoveFriendHandler } from "../src/Protocol/GameClientInterface/Handlers/AddRemoveFriend";
import { ServerMock } from "./Mocks/ServerMock";
import { ClientMock } from "./Mocks/ClientMock";
import { ObjectId } from "mongodb";
import { SocketMock } from "./Mocks/SocketMock";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function setupIncomingMessage(good : boolean) : Buffer {
    let incomingMessage : Buffer;
    if(good) {
        let id : ObjectId = new ObjectId();
        let byteLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let flags : number = 0;
        let online : boolean = getRandomInt(100) > 50 ? true : false;
        let remove : boolean = getRandomInt(100) > 50 ? true : false;
        if (online) {
            flags |= 0b01;
        }
        if (remove) {
            flags |= 0b10;
        }
        incomingMessage = Buffer.allocUnsafe(2 + byteLength);
        incomingMessage.writeUInt8(byteLength, 0);
        incomingMessage.write(id.toHexString(), 1, byteLength, 'utf-8');
        incomingMessage.writeUInt8(flags, 1 + byteLength);
    } else {
        incomingMessage = Buffer.allocUnsafe(32);
    }

    return incomingMessage;
}

describe("AddRemoveFriend Handler", () => {

    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), [], server);
        let handler : AddRemoveFriendHandler = new AddRemoveFriendHandler(1);

        expect(handler.handle(setupIncomingMessage(true), myClient)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), [], server);
        let handler : AddRemoveFriendHandler = new AddRemoveFriendHandler(1);

        expect(handler.handle(setupIncomingMessage(false), myClient)).to.be.false;

        done();
    });

});

describe("AddRemoveFriend Message", () => {

    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 8;
        let id : ObjectId = new ObjectId();
        let idLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let username : string = "testUsername";
        let usernameLength : number = Buffer.byteLength(username, 'utf-8');
        let flags : number = 0;
        let online : boolean = true;
        let remove : boolean = true;
        if (online) {
            flags |= 0b01;
        }
        if (remove) {
            flags |= 0b10;
        }

        let bufferSize : number = expectedSize + idLength + usernameLength;
        let truth : Buffer = Buffer.allocUnsafe(bufferSize);

        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(bufferSize, 1);
        truth.writeUInt8(idLength, 5);
        truth.write(id.toHexString(), 6, idLength, 'utf-8');
        truth.writeUInt8(usernameLength, 6 + idLength);
        truth.write(username, 7 + idLength, usernameLength, 'utf-8');
        truth.writeUInt8(flags, 7 + idLength + usernameLength);

        // Instatiate test instance
        let friend : AddRemoveFriend = new AddRemoveFriend(messageId);
        friend.id = id.toHexString();
        friend.username = username;
        friend.online = online;
        friend.remove = remove;
        let buffer : Buffer = friend.serialize();
        
        expect(buffer.equals(truth)).to.be.true;

        friend.online = false;
        friend.remove = false;
        friend.serialize();

        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : ObjectId = new ObjectId();
        let idLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let flags : number = 0b01;
        let truth : Buffer = Buffer.allocUnsafe(2 + idLength);
        truth.writeUInt8(idLength, 0);
        truth.write(id.toHexString(), 1, idLength, 'utf8');
        truth.writeUInt8(flags, 1 + idLength);

        let friend : AddRemoveFriend = new AddRemoveFriend(1);
        expect(friend.valid).to.be.false;

        friend.deserialize(truth);
        expect(friend.valid).to.be.true;

        expect(friend.id === id.toHexString());
        expect(friend.remove).to.be.true;

        flags = 0b00;
        truth.writeUInt8(flags, 1 + idLength);

        friend.deserialize(truth);
        expect(friend.remove).to.be.false;
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let friend : AddRemoveFriend = new AddRemoveFriend(1, lie);

        expect(friend.valid).to.be.false;

        done();
    });

});
