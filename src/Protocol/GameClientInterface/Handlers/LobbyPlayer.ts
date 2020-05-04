
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { LobbyPlayer } from "../Messages/LobbyPlayer";
import { ILobby } from "../../../Interfaces/ILobby";
import { UserServerManager } from "../../../UserServerManager";
import { IUserClient } from "../../../Interfaces/IUserClient";

export class LobbyPlayerHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IUserClient): boolean {
        let message : LobbyPlayer = new LobbyPlayer(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let myServer : UserServerManager = myClient.connectionManager as UserServerManager;
            let lobby : ILobby | undefined = myServer.lobbyMgr.getLobbyOfClient(myClient);

            if (lobby) {
                if (message.requestingToLeaveLobby) {
                    lobby.removePlayer(myClient);
                    myClient.isReady = false;
                } else {
                    myClient.isReady = message.isReady;
                    lobby.update();
                }
            }
            return true;
        } else {
            return false;
        }
    }

}
