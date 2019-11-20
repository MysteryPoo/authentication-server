
import { expect } from "chai";
import { Client } from "../src/Client";
import { Socket, Server } from "net";
import { Ping } from "../src/Messages/Ping";

/* Mocking this class doesn't work right now
class SocketMock extends Socket {

    public write(buffer: Uint8Array | string): boolean {
        console.log(buffer);
        console.log("Writing buffer to TCP");
        return true;
    }
}
*/

describe("Client", () => {

    it("Processes messages", async () => {
        // Doing this wrong because I can't figure out how to properly mock a net.Socket 
        let server : Server = new Server( (socket : Socket) => {
            const client : Client = new Client(socket);
        });
        server.listen(8081);

        let fakeClient = new Socket();
        
        return new Promise<any>( (resolve) => {
            fakeClient.connect(8081, "localhost", () => {
                let buffer : Buffer = Buffer.allocUnsafe(24);
                buffer.writeUInt8(4, 0);
                fakeClient.write(buffer);
                fakeClient.end();
                setTimeout( () => {
                    server.close(resolve);
                }, 10);
            });
        });
    });
});