
import { Socket } from "net";
import { IServer, MESSAGE_ID } from "./Server";
import { v4 as uuid } from "uuid";

export interface IClient {
    uid : string;
    authenticated : boolean;

    write(buffer : Buffer) : boolean;
    destroy() : void;
}

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
        });
    }

    public write(buffer : Buffer) : boolean {
        return this.socket.write(buffer);
    }

    public destroy() : void {
        this.socket.destroy();
    }

}
