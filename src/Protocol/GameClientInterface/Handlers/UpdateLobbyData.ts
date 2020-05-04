import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { UpdateLobbyData } from "../Messages/UpdateLobbyData";
import { UserServerManager } from "../../../UserServerManager";
import { ILobby } from "../../../Interfaces/ILobby";
import { IUserClient } from "../../../Interfaces/IUserClient";

export class UpdateLobbyDataHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IUserClient): boolean {
        let message : UpdateLobbyData = new UpdateLobbyData(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let serv : UserServerManager = this.serverRef as UserServerManager;
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
