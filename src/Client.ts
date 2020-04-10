
import { Socket } from "net";
import { IUser, IUserModel } from "./Models/User.model";
import { Ping } from "./Messages/Ping";
import { AcquireAvatar } from "./Messages/AcquireAvatar";

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
        this.socket.on('data', (data : Buffer) => {
            let tell = 0;
            let success = false;
            while(tell < data.byteLength) {
                let messageType : MESSAGE_ID = data.readUInt8(tell);
                let messageSize : number = data.readUInt32LE(tell + 1);
                let messageData : Buffer = data.slice(tell + 5, tell + messageSize);
                switch(messageType) {
                    case MESSAGE_ID.AcquireAvatar:
                        let acquireAvatar : AcquireAvatar = new AcquireAvatar(messageType);
                        acquireAvatar.deserialize(messageData);
                        
                        break;
                    case MESSAGE_ID.Ping:
                        let ping : Ping = new Ping(messageType);
                        ping.deserialize(messageData);
                        success = this.socket.write(ping.serialize());
                        break;
                    default:
                        console.log("Unsupported message received.");
                        break;
                }
                tell += messageSize;
            }
            console.log(data);
            return success;
        });
    }

}
