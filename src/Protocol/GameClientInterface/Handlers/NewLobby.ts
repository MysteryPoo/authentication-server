
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { NewLobby } from "../Messages/NewLobby";
import { UserServerManager } from "../../../UserServerManager";
import { ILobby } from "../../../Interfaces/ILobby";
import { IUserClient } from "../../../Interfaces/IUserClient";

export class NewLobbyHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IUserClient): boolean {
        let message : NewLobby = new NewLobby(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let server : UserServerManager = this.serverRef as UserServerManager;
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
