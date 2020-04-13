
import { expect } from "chai";
import { IMessageHandler } from "../src/Messages/MessageBase";
import { AcquireAvatarHandler } from "../src/Messages/AcquireAvatar";
import { IServer } from "../src/Server";
import { Client } from "../src/Client";
import { Socket } from "net";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

class ServerMock implements IServer {
    handlerList: IMessageHandler[] = [];
    socketList : Array<Client> = [];
}

describe("AcquireAvatarHandler", () => {

    it("should handle properly", (done) => {
        let server : ServerMock = new ServerMock();
        let mySocket : Socket = new Socket();
        let handler : AcquireAvatarHandler = new AcquireAvatarHandler(server, 1);

        expect(handler.handle.bind(handler, Buffer.allocUnsafe(32), mySocket)).to.be.true;
    });

});
