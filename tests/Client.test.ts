
import { expect } from "chai";
import { Client } from "../src/Client";
import { Socket } from "net";
import { Ping } from "../src/Messages/Ping";

class SocketMock extends Socket {

    public write(buffer: Uint8Array | string): boolean {
        console.log(buffer);
        console.log("Writing buffer to TCP");
        return true;
    }
}

describe("Client", () => {

    let client : Client;
    let socket : SocketMock;

    beforeEach( (done) => {
        socket = new SocketMock();
        client = new Client(socket);
        done();
    });

    it("Processes Ping messages", (done) => {
        let ping : Ping = new Ping(1);
        ping.time = 1234;
        expect(client.onData(ping.serialize())).to.be.true;
        done();
    });
});