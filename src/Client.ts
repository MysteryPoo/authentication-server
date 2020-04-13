
import { Socket } from "net";
import { IServer, MESSAGE_ID } from "./Server";

export class Client {

    public uid : number = 0;

    constructor(private socket : Socket, private serverRef : IServer) {
        
        this.socket.on('data', (data : Buffer) => {
            let tell : number = 0;
            let success : boolean = false;
            while(tell < data.byteLength) {
                let messageType : MESSAGE_ID = data.readUInt8(tell);
                let messageSize : number = data.readUInt32LE(tell + 1);
                let messageData : Buffer = data.slice(tell + 5, tell + messageSize);
                success = success && this.serverRef.handlerList[messageType].handle(messageData, socket);
                tell += messageSize;
            }
            console.log(data);
            return success;
        });
    }

}
