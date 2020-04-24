
import { IUserClient } from "../../src/Interfaces/IUserClient";
import { IServer } from "../../src/Interfaces/IServer";
import { SocketMock } from "./SocketMock";

export class ClientMock implements IUserClient {

    public uid: string = "";
    public authenticated: boolean = false;
    public isReady: boolean = false;
    public gameVersion: number = 0;

    constructor(private socket : SocketMock, private serverRef : IServer) {

    }

    write(buffer: Buffer): boolean {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }

    ValidateMessageId(identifier: number): boolean {
        throw new Error("Method not implemented.");
    }
    GetMessageTypeString(identifier: number): string {
        throw new Error("Method not implemented.");
    }

}
