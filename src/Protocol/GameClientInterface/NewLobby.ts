
import { MessageBase } from "../../Abstracts/MessageBase";
import { MessageHandlerBase } from "../../Abstracts/MessageHandlerBase";
import { IClient } from "../../Interfaces/IClient";
import { ILobby } from "../../Interfaces/ILobby";
import { UserServer } from "../../UserServer";

export class NewLobby extends MessageBase {

    public isPublic! : boolean;
    public maxPlayers! : number;

    serialize(): Buffer {
        throw new Error("Method not implemented.");
    }

    deserialize(buffer: Buffer): void {
        try {
            this.validate(buffer, 2);

            this.isPublic = buffer.readUInt8(0) === 0 ? false : true;
            this.maxPlayers = buffer.readUInt8(1);

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}

export class NewLobbyHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : NewLobby = new NewLobby(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let server : UserServer = this.serverRef as UserServer;
            let lobby : ILobby | undefined = server.lobbyMgr.getLobbyOfClient(myClient);

            if (lobby) {
                lobby.removePlayer(myClient);
            }

            server.lobbyMgr.createLobby(myClient, message.isPublic, message.maxPlayers);
            return true;
        } else {
            return false;
        }
    }
    
}
