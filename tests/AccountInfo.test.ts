
import { expect } from "chai";
import { SetVisibleUsername, SetVisibleUsernameHandler } from "../src/Messages/AccountInfo";
import { ServerMock } from "./Mocks/ServerMock";
import { ClientMock } from "./Mocks/ClientMock";
import { SocketMock } from "./Mocks/SocketMock";

function setupIncomingMessage(good : boolean) : Buffer {
    let incomingMessage : Buffer;
    if(good) {
        let username : string = "Test Username";
        let byteLength : number = Buffer.byteLength(username, 'utf-8');
        incomingMessage = Buffer.allocUnsafe(1 + byteLength);
        incomingMessage.writeUInt8(byteLength, 0);
        incomingMessage.write(username, 1, byteLength, 'utf-8');
    } else {
        incomingMessage = Buffer.allocUnsafe(32);
    }

    return incomingMessage;
}

describe("SetVisibleUsername Message", () => {

    it("should fail to serialize", (done) => {
        let setVisibleUsername : SetVisibleUsername = new SetVisibleUsername(1);

        expect(setVisibleUsername.serialize.bind(setVisibleUsername)).to.throw("Method not implemented.");

        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : string = "ABCD1234EFG";
        let truth : Buffer = Buffer.allocUnsafe(1 + id.length);
        truth.writeUInt8(id.length, 0);
        truth.write(id, 1, id.length, 'utf8');

        let setVisibleUsername : SetVisibleUsername = new SetVisibleUsername(1);
        expect(setVisibleUsername.valid).to.be.false;

        setVisibleUsername.deserialize(truth);
        expect(setVisibleUsername.valid).to.be.true;

        expect(setVisibleUsername.username).to.equal(id);
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let setVisibleUsername : SetVisibleUsername = new SetVisibleUsername(1, lie);
        expect(setVisibleUsername.valid).to.be.false;

        done();
    });

});

describe("SetVisibleUsername Handler", () => {
    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : SetVisibleUsernameHandler = new SetVisibleUsernameHandler(server, 1);

        expect(handler.handle(setupIncomingMessage(true), myClient)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : SetVisibleUsernameHandler = new SetVisibleUsernameHandler(server, 1);

        expect(handler.handle(setupIncomingMessage(false), myClient)).to.be.false;

        done();
    });
});
