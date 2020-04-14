
import { expect } from "chai";
import { PingHandler, Ping } from "../src/Messages/Ping";
import { ServerMock } from "./Mocks/ServerMock";
import { ClientMock } from "./Mocks/ClientMock";
import { SocketMock } from "./Mocks/SocketMock";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function setupIncommingPing(good : boolean) : Buffer {
    var incommingPing : Buffer;
    if (good) {
        incommingPing = Buffer.allocUnsafe(4);
    } else {
        incommingPing = Buffer.allocUnsafe(32);
    }
    incommingPing.writeUInt32LE(1234, 0);

    return incommingPing;
}

describe("Ping Handler", () => {
    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : PingHandler = new PingHandler(server, 1);

        expect(handler.handle(setupIncommingPing(true), myClient)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let myClient : ClientMock = new ClientMock(new SocketMock(), server);
        let handler : PingHandler = new PingHandler(server, 1);

        expect(handler.handle(setupIncommingPing(false), myClient)).to.be.false;

        done();
    });
});

describe("Ping Message", () => {
    it("should automatically deserialize if provided a buffer", (done) => {
        let ping : Ping = new Ping(1, setupIncommingPing(true));

        expect(ping.valid).to.be.true;

        done();
    });

    it("should remain invalid if not provided a buffer", (done) => {
        let ping : Ping = new Ping(1);

        expect(ping.valid).to.be.false;

        done();
    });

    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 9;
        let timeValue : number = getRandomInt(65535);
        let truth : Buffer = Buffer.allocUnsafe(expectedSize);
        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(expectedSize, 1);
        truth.writeUInt32LE(timeValue, 5);

        // Instatiate test instance
        let ping : Ping = new Ping(messageId);
        ping.time = timeValue;
        let buffer : Buffer = ping.serialize();
        
        expect(buffer.equals(truth)).to.be.true;

        done();
    });

    it("should deserialize to a valid time value if valid buffer received", (done) => {
        // Setup truth
        let timeValue : number = getRandomInt(65535);
        let truth : Buffer = Buffer.allocUnsafe(4);
        truth.writeUInt32LE(timeValue, 0);

        let ping : Ping = new Ping(1);
        expect(ping.valid).to.be.false;

        ping.deserialize(truth);
        expect(ping.valid).to.be.true;

        expect(ping.time).to.equal(timeValue);
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let ping : Ping = new Ping(1, lie);

        expect(ping.valid).to.be.false;

        done();
    });
});
