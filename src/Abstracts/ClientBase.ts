
import { Socket, SocketConnectOpts } from "net";
import { v4 as uuid } from "uuid";
import { IClient } from "../Interfaces/IClient";
import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { IConnectionManager } from "../Interfaces/IConnectionManager";

class Header {
    constructor(public messageId : number, public messageSize : number) {}
}

class Packet {
    constructor(public header : Header, public data : Buffer) {}

    get isValid() : boolean {
        return this.header.messageSize - 5 === this.data.length;
    }
}

export abstract class ClientBase implements IClient {

    public uid : string = uuid();
    public authenticated : boolean = false;
    public isConnected : boolean = false;
    public lastConnectionError : Error = new Error();

    constructor(
        private socket : Socket,
        protected handlerList : IMessageHandler[],
        readonly connectionManager : IConnectionManager,
        connectionOptions? : SocketConnectOpts,
        onConnectCallback? : () => void
        ) {

        if (connectionOptions) {
            socket.connect(connectionOptions, onConnectCallback);
        }

        this.socket.on('data', (data : Buffer) => {
            let tell : number = 0;
            while(tell < data.byteLength) {
                //let rawIdentifier : number = data.readUInt8(tell);
                //let messageSize : number = data.readUInt32LE(tell + 1);
                //let messageData : Buffer = data.slice(tell + 5, tell + messageSize);

                let packet : Packet = this.parseMessage(data, tell);

                if (this.ValidateMessageId(packet.header.messageId)) {
                    if (packet.isValid) {
                        if (this.handlerList[packet.header.messageId]) {
                            this.handlerList[packet.header.messageId].handle(packet.data, this);
                        } else {
                            console.error(`No handler registered for this messageType: ${this.GetMessageTypeString(packet.header.messageId)}(${packet.header.messageId})`);
                        }
                    } else {
                        console.error(`Packet invalid: type [${this.GetMessageTypeString(packet.header.messageId)}]; data [${packet.data}]`);
                    }
                } else {
                    console.error(`Unknown messageType: ${packet.header.messageId}`);
                }
                tell += packet.header.messageSize;
            }
        })
        .on('error', (err : Error) => {
            console.error(err);
            this.lastConnectionError = err;
        })
        .on('close', (had_error) => {
            if (had_error) {
                console.error("Unknown error ocurred when client disconnected.");
            } else {
                console.debug(`Console: Socket has closed.`);
            }
            this.isConnected = false;
            this.connectionManager.handleDisconnect(this);
        });
    }

    abstract ValidateMessageId(identifier : number): boolean;

    abstract GetMessageTypeString(identifier : number) : string;

    public write(buffer : Buffer) : boolean {
        this.isConnected = this.socket.write(buffer);
        return this.isConnected;
    }

    public destroy() : void {
        this.socket.destroy();
        this.socket.unref();
    }

    private parseMessage(buffer : Buffer, tell : number) : Packet {
        let header : Header = this.extractHeader(buffer, tell);
        let messageData : Buffer = buffer.slice(tell + 5, tell + header.messageSize);

        return new Packet(header, messageData);
    }

    private extractHeader(buffer : Buffer, tell : number) : Header {
        let rawIdentifier : number = buffer.readUInt8(tell);
        let messageSize : number = buffer.readUInt32LE(tell + 1);

        return new Header(rawIdentifier, messageSize);
    }

}
