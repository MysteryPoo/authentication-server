
import { IClient } from "../../src/Client";
import { IServer } from "../../src/Server";
import { SocketMock } from "./SocketMock";
import { v4 as uuid } from "uuid";

export class ClientMock implements IClient {
    
    public uid: string = uuid();
    public authenticated: boolean = false;

    constructor(private socket : SocketMock, private serverRef : IServer) {
        
    }

    public write(buffer : Buffer) : boolean {
        return this.socket.write(buffer);
    }

    public destroy() : void {
        this.socket.destroy();
    }
}
