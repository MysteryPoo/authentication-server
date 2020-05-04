
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IUserClient } from "../../../Interfaces/IUserClient";
import { ILobby } from "../../../Interfaces/ILobby";
import { UserServerManager } from "../../../UserServerManager";
import { QUEUE_ERROR } from "../../../Interfaces/ILobbyManager";
import { StartGame } from "../Messages/StartGame";

export class StartGameHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IUserClient): boolean {
        if (myClient.authenticated) {
            let userServer : UserServerManager = this.serverRef as UserServerManager;
            let lobby : ILobby | undefined = userServer.lobbyMgr.getLobbyOfClient(myClient);

            if (lobby) {
                let error : QUEUE_ERROR = userServer.lobbyMgr.addToQueue(lobby);
                let response : StartGame = new StartGame(this.messageId);
                console.debug(error);
                switch (error) {
                    case QUEUE_ERROR.OK:
                        // Start game
                        response.ip = "Requesting server...";
                        response.port = 0;
                        response.token = 0;
                        lobby.requestGameServer().then( (port : number) => {
                            lobby!.gameServerPort = port;
                        }).catch( (reason) => {
                            console.error(reason);
                        });
                        break;
                    case QUEUE_ERROR.ALREADY_STARTED:
                        response.ip = "Game already started.";
                        response.port = 0;
                        response.token = 0;
                        break;
                    case QUEUE_ERROR.INSUFFICIENT_PLAYERS:
                        response.ip = "Insufficient players.";
                        response.port = 0;
                        response.token = 0;
                        break;
                    case QUEUE_ERROR.NO_SERVER_AVAILABLE:
                        response.ip = "No servers available.";
                        response.port = 0;
                        response.token = 0;
                        break;
                    case QUEUE_ERROR.PLAYERS_NOT_READY:
                        response.ip = "Not all players are ready.";
                        response.port = 0;
                        response.token = 0;
                        break;
                }
                for (let client of lobby.clientList) {
                    client.write(response.serialize());
                }
            }
            return true;
        } else {
            return false;
        }
    }

}
