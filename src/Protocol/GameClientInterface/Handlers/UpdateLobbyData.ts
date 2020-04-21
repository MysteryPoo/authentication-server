import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { UpdateLobbyData } from "../Messages/UpdateLobbyData";
import { UserServer } from "../../../UserServer";
import { ILobby } from "../../../Interfaces/ILobby";

export class UpdateLobbyDataHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : UpdateLobbyData = new UpdateLobbyData(this.messageId, buffer);

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
