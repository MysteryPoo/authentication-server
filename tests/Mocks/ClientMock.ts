
import { IUserClient } from "../../src/Interfaces/IUserClient";
import { SocketMock } from "./SocketMock";
import { IConnectionManager } from "../../src/Interfaces/IConnectionManager";
import { IMessageHandler } from "../../src/Interfaces/IMessageHandler";
import { SocketConnectOpts } from "net";

export class ClientMock implements IUserClient {

    public uid: string = "";
    public authenticated: boolean = false;
    public isReady: boolean = false;
    public gameVersion: number = 0;

    constructor(
        private socket : SocketMock,
        protected handlerList : IMessageHandler[],
        readonly connectionManager : IConnectionManager,
        connectionOptions? : SocketConnectOpts,
        onConnectCallback? : () => void
        )
        {}

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
