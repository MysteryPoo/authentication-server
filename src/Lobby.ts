
import { ILobby, ERROR } from "./Interfaces/ILobby";
import { ILobbyManager } from "./Interfaces/ILobbyManager";
import { IGameServer } from "./Interfaces/IGameServer";
import { IMessageBase } from "./Interfaces/IMessageBase";
import { UpdateLobbyData } from "./Protocol/GameClientInterface/Messages/UpdateLobbyData";
import { MESSAGE_ID } from "./UserServerManager";
import { LobbyPlayer } from "./Protocol/GameClientInterface/Messages/LobbyPlayer";
import { IUserClient } from "./Interfaces/IUserClient";
import { StartGame } from "./Protocol/GameClientInterface/Messages/StartGame";

export class Lobby implements ILobby {

    clientList : IUserClient[] = [];
    numberOfLaunchAttempts : number = 0;
    gameServer : IGameServer | null = null;
    gameServerPort : number = 0;
    gameServerPassword : string = "TEST";
    gameVersion : number = 0;
    requestedGameServer = false;

    constructor(private lobbyMgrRef : ILobbyManager, host : IUserClient, public isPublic : boolean, public maxPlayers : number) {
        this.clientList.push(host);
        this.gameVersion = host.gameVersion;
        this.update();
    }

    addPlayer(client: IUserClient): ERROR {
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

    containsPlayer(client: IUserClient): boolean {
        let test = this.clientList.find( (element) => {
            return element.uid === client.uid;
        });
        return test != undefined;
    }

    containsPlayerId(clientId : string) : boolean {
        let test = this.clientList.find( (e) => {
            return e.uid === clientId;
        });
        return test != undefined;
    }

    removePlayer(client: IUserClient): boolean {
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

    async requestGameServer() : Promise<number> {
        return new Promise<number>( (resolve, reject) => {
            if (this.requestedGameServer) {
                reject("Already requested.");
            } else {
                this.requestedGameServer = true;
                resolve(this.lobbyMgrRef.containerManager.createGameServerContainer(this.clientList[0].uid, this.gameServerPassword));
            }
        });
    }

    getAvailableSlots() : number {
        return this.maxPlayers - this.clientList.length;
    }

    setPublic(isPublic : boolean) {
        this.isPublic = isPublic;
        this.update();
    }

    start() : void {
        let response : StartGame = new StartGame(MESSAGE_ID.StartGame);
        response.ip = "127.0.0.1";
        response.port = this.gameServerPort;
        response.token = 1234;
        for (let client of this.clientList) {
            client.write(response.serialize());
        }
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
