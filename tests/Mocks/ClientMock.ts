
import { IClient } from "../../src/Client";
import { IServer } from "../../src/Server";
import { SocketMock } from "./SocketMock";
import { v4 as uuid } from "uuid";

export class ClientMock extends SocketMock implements IClient {
    
    public uid: string = uuid();
    public authenticated: boolean = false;

    constructor(private socket : SocketMock, private serverRef : IServer) {
        super();
    }
}
