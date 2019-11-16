
import { Socket } from "net";
import { Ping } from "./Messages/Ping";

enum MESSAGE_ID {
	"AcquireAvatar",
	"AcquireDice",
	"Challenge",
	"MessageBase",
	"Ping",
	"SetUsername"
};

export class Client {

    public uid : number;

    constructor(private socket : Socket) {
        this.uid = 0;
        this.socket.on('data', this.onData);
    }

    public onData(data : Buffer) : boolean {
        let tell = 0;
        let success = false;
        while(tell < data.byteLength) {
            let messageType : MESSAGE_ID = data.readUInt8(tell);
            let messageSize : number = data.readUInt32LE(tell + 1);
            let messageData : Buffer = data.slice(tell + 5, tell + messageSize);
            switch(messageType) {
                case MESSAGE_ID.Ping:
                    let ping : Ping = new Ping(messageType, messageData);
                    success = this.socket.write(ping.serialize());
                    break;
            }
            //let handler : IMessageHandler = createHandlerFromPacket(messageType, socket, messageData);
            //handler.handle();
            tell += messageSize;
        }
        console.log(data);
        return success;
    }

}
