
import { Socket } from "net";
import { IServer } from "./Interfaces/IServer";
import { v4 as uuid } from "uuid";
import { IClient } from "./Interfaces/IClient";
import { MESSAGE_ID } from "./UserServer";

export class Client implements IClient {

    public uid : string = uuid();
    public authenticated : boolean = false;
    public isReady : boolean = false;
    public gameVersion : number = 0;

    constructor(private socket : Socket, private serverRef : IServer) {

        this.socket.on('data', (data : Buffer) => {
            let tell : number = 0;
            let success : boolean = false;
            while(tell < data.byteLength) {
                let rawIdentifier : number = data.readUInt8(tell);
                let messageSize : number = data.readUInt32LE(tell + 1);
                let messageData : Buffer = data.slice(tell + 5, tell + messageSize);

                let messageType : MESSAGE_ID;
                if (rawIdentifier >= MESSAGE_ID.FIRST && rawIdentifier <= MESSAGE_ID.LAST) {
                    messageType = rawIdentifier;
                    if (this.serverRef.handlerList[messageType]) {
                        this.serverRef.handlerList[messageType].handle(messageData, this);
                    } else {
                        console.error(`No handler registered for this messageType: ${messageType}`);
                    }
                } else {
                    console.error(`Unknown messageType: ${rawIdentifier}`);
                }
                tell += messageSize;
            }
            //console.log(data);
            return success;
        })
        .on('close', (had_error) => {
            if (had_error) {
                console.error("Unknown error ocurred when client disconnected.");
            } else {
                console.debug(`Console: Socket has closed.`);
            }

            // TODO : Notify friends

            // Delete
            this.serverRef.removeClient(this);
        });
    }

    public write(buffer : Buffer) : boolean {
        return this.socket.write(buffer);
    }

    public destroy() : void {
        this.socket.destroy();
        this.socket.unref();
    }

}
