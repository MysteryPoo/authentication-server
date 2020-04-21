
import { ILobby, ERROR } from "./Interfaces/ILobby";
import { ILobbyManager } from "./Interfaces/ILobbyManager";
import { IClient } from "./Interfaces/IClient";
import { IGameServer } from "./Interfaces/IGameServer";
import { IMessageBase } from "./Interfaces/IMessageBase";
import { UpdateLobbyData } from "./Protocol/GameClientInterface/Messages/UpdateLobbyData";
import { MESSAGE_ID } from "./UserServer";
import { LobbyPlayer } from "./Protocol/GameClientInterface/Messages/LobbyPlayer";

export class Lobby implements ILobby {

    clientList : IClient[] = [];
    numberOfLaunchAttempts : number = 0;
    gameServer : IGameServer | null = null;
    gameVersion : number = 0;

    constructor(private lobbyMgrRef : ILobbyManager, host : IClient, public isPublic : boolean, public maxPlayers : number) {
        this.clientList.push(host);
        this.gameVersion = host.gameVersion;
        this.update();
    }

    addPlayer(client: IClient): ERROR {
        if (this.clientList.length === this.maxPlayers) {
            return ERROR.INSUFFICIENT_SPACE;
        }

        if (client.gameVersion !== this.gameVersion) {
            return ERROR.WRONG_VERSION;
        }

        if (this.containsPlayer(client)) {
            return ERROR.DUPLICATE;
        }

        this.clientList.push(client);
        this.update();
        return ERROR.OK;
    }

    containsPlayer(client: IClient): boolean {
        let test = this.clientList.find( (element) => {
            return element.uid === client.uid;
        });
        return test != undefined;
    }

    removePlayer(client: IClient): boolean {
        let index = this.clientList.findIndex( (element) => {
			return element.uid === client.uid;
		});
		if(index >= 0) {
			this.clientList.splice(index, 1);
			this.update();
			return true;
		}
		
		return false;
    }
    isReadyToQueue(): boolean {
        let isReady = true;
		for(let i = 0; i < this.clientList.length; ++i) {
			if(!this.clientList[i].isReady) {
				isReady = false;
			}
		}
		return isReady;
    }

    requestGameServer(): void {
        throw new Error("Method not implemented.");
    }

    getAvailableSlots() : number {
        return this.maxPlayers - this.clientList.length;
    }

    setPublic(isPublic : boolean) {
        this.isPublic = isPublic;
        this.update();
    }

    update() : void {
        // Bundle multiple messages together
        let packetList : Array<IMessageBase> = [];

        // First message will be the lobby data
        let lobbyData : UpdateLobbyData = new UpdateLobbyData(MESSAGE_ID.LobbyData);
        lobbyData.numClients = this.clientList.length;
        lobbyData.maxClients = this.maxPlayers;
        lobbyData.isPublic = this.isPublic;
        packetList.push(lobbyData);
        
        // Information about each client in the lobby
        let clientListIndex = 0;
        for (let client of this.clientList) {
            let lobbyPlayer : LobbyPlayer = new LobbyPlayer(MESSAGE_ID.LobbyPlayer);
            lobbyPlayer.clientListIndex = clientListIndex++;
            lobbyPlayer.id = client.uid;
            lobbyPlayer.isReady = client.isReady;

            packetList.push(lobbyPlayer);
        }

        // Notify clients
        for (let client of this.clientList) {
            for (let message of packetList) {
                client.write(message.serialize());
            }
        }

        // Close out lobby, if empty
        if (this.clientList.length === 0) {
            this.lobbyMgrRef.removeLobby(this);
        }
        
    }
    
}
