
import { Socket } from "net";
import { IServer } from "./Interfaces/IServer";
import { v4 as uuid } from "uuid";
import { IClient } from "./Interfaces/IClient";
import { MESSAGE_ID } from "./UserServer";

export class Client implements IClient {

    public uid : string = uuid();
    public authenticated : boolean = false;

    constructor(private socket : Socket, private serverRef : IServer) {

        this.socket.on('data', (data : Buffer) => {
            let tell : number = 0;
            let success : boolean = false;
            while(tell < data.byteLength) {
                let messageType : MESSAGE_ID = data.readUInt8(tell);
                let messageSize : number = data.readUInt32LE(tell + 1);
                let messageData : Buffer = data.slice(tell + 5, tell + messageSize);
                if (this.serverRef.handlerList[messageType]) {
                    this.serverRef.handlerList[messageType].handle(messageData, this);
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
            // TODO : Remove from Lobby and Queue

            // TODO : Notify friends

            // Delete
            this.serverRef.socketMap.delete(this.uid);
            this.destroy();
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
