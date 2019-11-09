
import { expect } from "chai";
import { Server } from "../src/Server";

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
})