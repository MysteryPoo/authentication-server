
import { expect } from "chai";
import { GetAvatarURLHandler, GetAvatarURL } from "../src/Protocol/GameClientInterface/AcquireAvatar";
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
        incomingMessage = Buffer.allocUnsafe(1 + byteLength);
        incomingMessage.writeUInt8(byteLength, 0);
        incomingMessage.write(id.toHexString(), 1, byteLength, 'utf-8');
    } else {
        incomingMessage = Buffer.allocUnsafe(32);
    }

    return incomingMessage;
}

describe("AcquireAvatar Message", () => {
    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 6;
        let url : string = "http://test.url.not.a.real.domain/";
        let urlLength : number = Buffer.byteLength(url, 'utf8');
        let bufferSize : number = expectedSize + urlLength;
        let truth : Buffer = Buffer.allocUnsafe(bufferSize);
        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(bufferSize, 1);
        truth.writeUInt8(urlLength, 5);
        truth.write(url, 6, url.length, 'utf8');

        // Instatiate test instance
        let acquireAvatar : GetAvatarURL = new GetAvatarURL(messageId);
        acquireAvatar.url = url;
        let buffer : Buffer = acquireAvatar.serialize();
        
        expect(buffer.equals(truth)).to.be.true;
        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : ObjectId = new ObjectId();
        let idLength : number = Buffer.byteLength(id.toHexString(), 'utf-8');
        let truth : Buffer = Buffer.allocUnsafe(1 + idLength);
        truth.writeUInt8(idLength, 0);
        truth.write(id.toHexString(), 1, idLength, 'utf8');

        let acquireAvatar : GetAvatarURL = new GetAvatarURL(1);
        expect(acquireAvatar.valid).to.be.false;

        acquireAvatar.deserialize(truth);
        expect(acquireAvatar.valid).to.be.true;

        expect(acquireAvatar.id.equals(id)).to.be.true;
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let acquireAvatar : GetAvatarURL = new GetAvatarURL(1, lie);

        expect(acquireAvatar.valid).to.be.false;

        done();
    });
});

describe("AcquireAvatar Handler", () => {

    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : GetAvatarURLHandler = new GetAvatarURLHandler(server, 1);

        expect(handler.handle(setupIncomingMessage(true), myClient)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : GetAvatarURLHandler = new GetAvatarURLHandler(server, 1);

        expect(handler.handle(setupIncomingMessage(false), myClient)).to.be.false;

        done();
    });

});
