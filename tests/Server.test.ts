
import { expect } from "chai";
import { Server } from "../src/Server";
import { Socket } from "net";
import { Client } from "../src/Client";

describe("Server", () => {

    var server : Server;

    beforeEach( (done) => {
        server = new Server();
        expect(server.listening).to.be.false;
        done();
    });

    it("should start listening", async () => {
        await server.start();
        expect(server.listening).to.be.true;
        await server.stop();
    });

    it("should stop listening when stopped.", async () => {
        await server.start();
        expect(server.listening).to.be.true;
        await server.stop();
        expect(server.listening).to.be.false;
    });

    it("should accept connections", async () => {
        await server.start();
        expect(server.listening).to.be.true;
        const client = new Socket();
        await new Promise( (resolve) => {
            client.connect( {port: 8080}, () => {
                client.end();
                resolve();
            });
        });
        return server.stop();
    });

    it("should error if starting on a used port", async () => {
        await server.start();
        expect(server.listening).to.be.true;
        const newServer = new Server();
        expect(newServer.start).to.throw;
        expect(newServer.listening).to.be.false;
        return server.stop();
    });

    it("should handle receiving data from clients", async() => {
        await server.start();
        expect(server.listening).to.be.true;
        let client1 : Socket = new Socket();
        let buffer1 : Buffer = Buffer.allocUnsafe(32);
        buffer1.writeUInt32LE(0, 0);
        await new Promise( (resolve) => {
            client1.connect( {port: 8080}, () => {
                client1.end(buffer1, () => {
                    setTimeout( () => {
                        resolve();
                    }, 2);
                });
            });
        });
        return server.stop();
    });
});
