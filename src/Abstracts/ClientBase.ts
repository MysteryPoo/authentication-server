
import { Socket } from "net";
import { IServer } from "../Interfaces/IServer";
import { v4 as uuid } from "uuid";
import { IClient } from "../Interfaces/IClient";

export abstract class ClientBase implements IClient {

    public uid : string = uuid();
    public authenticated : boolean = false;

    constructor(private socket : Socket, protected serverRef : IServer) {

        this.socket.on('data', (data : Buffer) => {
            let tell : number = 0;
            while(tell < data.byteLength) {
                let rawIdentifier : number = data.readUInt8(tell);
                let messageSize : number = data.readUInt32LE(tell + 1);
                let messageData : Buffer = data.slice(tell + 5, tell + messageSize);

                if (this.ValidateMessageId(rawIdentifier)) {
                    if (this.serverRef.handlerList[rawIdentifier]) {
                        this.serverRef.handlerList[rawIdentifier].handle(messageData, this);
                    } else {
                        console.error(`No handler registered for this messageType: ${this.GetMessageTypeString(rawIdentifier)}(${rawIdentifier})`);
                    }
                } else {
                    console.error(`Unknown messageType: ${rawIdentifier}`);
                }
                tell += messageSize;
            }
            //console.log(data);
        })
        .on('error', (err : Error) => {
            console.error(err);
        })
        .on('close', (had_error) => {
            if (had_error) {
                console.error("Unknown error ocurred when client disconnected.");
            } else {
                console.debug(`Console: Socket has closed.`);
            }

            // Delete
            this.serverRef.removeClient(this);
        });
    }

    abstract ValidateMessageId(identifier : number): boolean;

    abstract GetMessageTypeString(identifier : number) : string;

    public write(buffer : Buffer) : boolean {
        return this.socket.write(buffer);
    }

    public destroy() : void {
        this.socket.destroy();
        this.socket.unref();
    }

}
