
import { expect } from "chai";
import { Server } from "../src/Server";
import { Socket } from "net";
import { doesNotReject } from "assert";

describe("Host", () => {

    var server : Server;

    beforeEach( () => {
        server = new Server();
    });
    
    afterEach( () => {
        server.stop();
    });

    it("should not be listening initially.", () => {
        expect(server.listening).to.be.false;
    })

    it("should start listening", async () => {
        expect(server.listening).to.be.false;
        await server.start();
        expect(server.listening).to.be.true;
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
        return new Promise( (resolve) => {
            client.connect( {port: 8080}, () => {
                client.end();
                resolve();
            });
        });
    });

    it("should error if starting on a used port", async () => {
        await server.start();
        expect(server.listening).to.be.true;
        const newServer = new Server();
        expect(newServer.start).to.throw;
        expect(newServer.listening).to.be.false;
    });
})