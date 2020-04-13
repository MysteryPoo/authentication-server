
import { expect } from "chai";
import { PingHandler, Ping } from "../src/Messages/Ping";
import { IMessageHandler } from "../src/Messages/MessageBase";
import { IServer } from "../src/Server";
import { Client } from "../src/Client";
import { Socket } from "net";

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

class ServerMock implements IServer {
    handlerList: IMessageHandler[] = [];
    socketList : Array<Client> = [];
}

class SocketMock extends Socket {
    write(buffer : Buffer) : boolean {
        return true;
    }
}

describe("Ping Handler", () => {
    it("should respond with a valid request", (done) => {
        let server : ServerMock = new ServerMock();
        let mySocket : SocketMock = new SocketMock();
        let handler : PingHandler = new PingHandler(server, 1);

        expect(handler.handle(setupIncommingPing(true), mySocket)).to.be.true;

        done();
    });

    it("should survive with an invalid request", (done) => {
        let server : ServerMock = new ServerMock();
        let mySocket : SocketMock = new SocketMock();
        let handler : PingHandler = new PingHandler(server, 1);

        expect(handler.handle(setupIncommingPing(false), mySocket)).to.be.false;

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
    })
});
