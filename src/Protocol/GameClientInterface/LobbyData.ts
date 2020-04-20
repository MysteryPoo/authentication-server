
import { MessageBase } from "../../Abstracts/MessageBase";
import { MessageHandlerBase } from "../../Abstracts/MessageHandlerBase";
import { IClient } from "../../Interfaces/IClient";
import { UserServer } from "../../UserServer";
import { ILobby } from "../../Interfaces/ILobby";

export class LobbyData extends MessageBase {

    public numClients! : number;
    public maxClients! : number;
    public isPublic! : boolean;

    serialize(): Buffer {
        let bufferSize : number = 8;
        let buffer = Buffer.allocUnsafe(bufferSize);
        buffer.writeUInt8(this.messageId, 0);
        buffer.writeUInt32LE(bufferSize, 1);
        buffer.writeUInt8(this.numClients, 5);
        buffer.writeUInt8(this.maxClients, 6);
        buffer.writeUInt8(this.isPublic ? 1 : 0, 7);
        return buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            this.validate(buffer, 2);

            this.isPublic = buffer.readUInt8(0) === 0 ? false : true;
            this.maxClients = buffer.readUInt8(1);

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }
    
}

// This is specific to UserServer
export class LobbyDataHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : LobbyData = new LobbyData(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let serv : UserServer = this.serverRef as UserServer;
            let lobby : ILobby | undefined = serv.lobbyMgr.getLobbyOfClient(myClient);

            if (lobby) {
                if(lobby.clientList[0] === myClient) {
                    lobby.maxPlayers = message.maxClients;
                    lobby.isPublic = message.isPublic;
                }
                for(let i = 0; i < lobby.clientList.length; ++i) {
                    lobby.clientList[i].isReady = false;
                }
                lobby.update();
            }
            return true;
        } else {
            return false;
        }
    }
    
}
