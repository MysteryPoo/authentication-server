
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { Handshake } from "../../GameServerInterface/Messages/Handshake";
import { STATE as gsState, IGameServer } from "../../../Interfaces/IGameServer";
import { GameServerServer } from "../../../GameServerServer";
import { ILobby } from "../../../Interfaces/ILobby";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IGameServer): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);
        let disconnect : boolean = false;

        if (message.valid) {
            let gameServerServer : GameServerServer = this.serverRef as GameServerServer;
            myClient.state = gsState.Available;
            myClient.authenticated = true;
            
            let host : IClient | undefined = gameServerServer.userServer.getClientById(message.playerIdList[0]);
            if (host) {
                let lobby : ILobby | undefined = gameServerServer.lobbyMgr.getLobbyOfClient(host);
                if (lobby && message.gameServerPassword === lobby.gameServerPassword) {
                    lobby.gameServer = myClient;
                    lobby.update();
                } else {
                    disconnect = true;
                }
            } else {
                disconnect = true;
            }
        } else {
            disconnect = true;
        }

        if (disconnect) {
            this.serverRef.removeClient(myClient);
            return false;
        }

        return true;
    }

}
