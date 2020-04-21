
import { expect } from "chai";
import { PurchaseDiceById } from "../src/Protocol/GameClientInterface/Messages/PurchaseDiceById";
import { PurchaseDiceByIdHandler } from "../src/Protocol/GameClientInterface/Handlers/PurchaseDiceById";
import { ServerMock } from "./Mocks/ServerMock";
import { ClientMock } from "./Mocks/ClientMock";
import { SocketMock } from "./Mocks/SocketMock";
import { ObjectId } from "mongodb";

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

describe("GetDiceURL Message", () => {

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
        let getDice : PurchaseDiceById = new PurchaseDiceById(messageId);
        getDice.url = url;
        let buffer : Buffer = getDice.serialize();
        
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

        let getDice : PurchaseDiceById = new PurchaseDiceById(1);
        expect(getDice.valid).to.be.false;

        getDice.deserialize(truth);
        expect(getDice.valid).to.be.true;

        expect(getDice.id === id.toHexString());

        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let getDice : PurchaseDiceById = new PurchaseDiceById(1, lie);

        expect(getDice.valid).to.be.false;

        done();
    });

});

describe("GetDiceURL Handler", () => {

    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : PurchaseDiceByIdHandler = new PurchaseDiceByIdHandler(server, 1);

        expect(handler.handle(setupIncomingMessage(true), myClient)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : PurchaseDiceByIdHandler = new PurchaseDiceByIdHandler(server, 1);

        expect(handler.handle(setupIncomingMessage(false), myClient)).to.be.false;

        done();
    });

});
