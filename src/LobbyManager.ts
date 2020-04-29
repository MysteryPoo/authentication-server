
import { ILobbyManager, QUEUE_ERROR } from "./Interfaces/ILobbyManager";
import { ILobby } from "./Interfaces/ILobby";
import { Lobby } from "./Lobby";
import { IUserClient } from "./Interfaces/IUserClient";
import { STATE } from "./Interfaces/IGameServer";

export class LobbyManager implements ILobbyManager {

    lobbyList: ILobby[] = [];
    lobbyQueue: ILobby[] = [];

    createLobby(host: IUserClient, isPublic: boolean, maxPlayers: number): ILobby {
        
        host.isReady = false;
        let newLobby : ILobby = new Lobby(this, host, isPublic, maxPlayers);
        this.lobbyList.push(newLobby);
        return newLobby;

    }

    getLobbyOfClient(client: IUserClient): ILobby | undefined {
        return this.lobbyList.find( (element) => {
			return element.containsPlayer(client);
		});
    }

    getLobbyOfClientId(clientId : string) : ILobby | undefined {
        return this.lobbyList.find( (element) => {
            return element.containsPlayerId(clientId);
        });
    }

    removeLobby(lobby: ILobby): boolean {
        // Remove from queue as well, if applicable
        this.removeFromQueue(lobby);
        
        let index = this.lobbyList.findIndex( (element) => {
			return lobby === element;
		});
		if(index >= 0) {
			this.lobbyList.splice(index, 1);
			console.log("LobbyController: Removing lobby.");
			console.log("LobbyController: Number of lobbies = " + this.lobbyList.length);
			console.log("LobbyController: Lobbies in Queue = " + this.lobbyQueue.length);
			return true;
		}
		console.log("LobbyController: Failed to remove lobby.");
		console.log("LobbyController: Number of lobbies = " + this.lobbyList.length);
		console.log("LobbyController: Lobbies in Queue = " + this.lobbyQueue.length);
		return false;
    }

    addToQueue(lobby: ILobby): QUEUE_ERROR {

        if (lobby.gameServer && lobby.gameServer.state === STATE.Started) {
            return QUEUE_ERROR.ALREADY_STARTED;
        }

        if (!lobby.isReadyToQueue()) {
            return QUEUE_ERROR.PLAYERS_NOT_READY;
        }

        const maxLaunchAttempts : number = 10;

        // Ready to get a game server assigned
        if (!lobby.isPublic || 
            lobby.getAvailableSlots() === 0 ||
            lobby.numberOfLaunchAttempts >= maxLaunchAttempts) {
                // Ready to start

                return QUEUE_ERROR.OK;
        }

        // Not ready for a game server, yet
        let potentialMerge : ILobby | undefined = this.getAvailableLobby(lobby, lobby.clientList.length);
        if (potentialMerge) {
            // We have a match for merging
            let mergedLobby : ILobby = this.mergeLobbies(potentialMerge, lobby);
            if (mergedLobby.getAvailableSlots() === 0) {
                // Immeidately start
                return QUEUE_ERROR.OK;
            } else {
                // Lobby merged, but still not full. Give it another round through the queue
                mergedLobby.numberOfLaunchAttempts += 1;
                // Not sure if this is needed, it should already be in the queue
                if(this.lobbyQueue.find( (element) => {
                    return element === mergedLobby;
                }) === undefined) {
                    this.lobbyQueue.push(mergedLobby);
                }
                return QUEUE_ERROR.INSUFFICIENT_PLAYERS;
            }
        } else {
            // Unable to start, enter the queue
            lobby.numberOfLaunchAttempts += 1;
            if(this.lobbyQueue.find( (element) => {
                return element === lobby;
            }) === undefined) {
                this.lobbyQueue.push(lobby);
            }

            return QUEUE_ERROR.INSUFFICIENT_PLAYERS;
        }
    }

    removeFromQueue(lobby: ILobby): boolean {
        let index = this.lobbyQueue.findIndex( (element) => {
			return lobby === element;
		});
		if(index >= 0) {
			this.lobbyQueue.splice(index, 1);
			console.log("LobbyController: Removed a lobby from queue.");
			console.log("LobbyController: Number of lobbies = " + this.lobbyList.length);
			console.log("LobbyController: Lobbies in Queue = " + this.lobbyQueue.length);
			return true;
		}
		return false;
    }

    private mergeLobbies(lobbyA: ILobby, lobbyB: ILobby): ILobby {
        // Note : This method will force two lobbies to merge regardless of their capacity. Caller's responsibility to check. Maybe add TODO here.
        for (let client of lobbyB.clientList) {
            //lobbyA.addPlayer(client); // Can't use this, as it has checks; need to bypass the checks for now
            lobbyA.clientList.push(client);
        }
        // Get rid of the now empty lobby
        this.removeLobby(lobbyB);

        // Notify clients
		lobbyA.update();
		
		console.log("LobbyController: Two lobbies have been merged.");
		console.log("LobbyController: Number of lobbies = " + this.lobbyList.length);
		console.log("LobbyController: Lobbies in Queue = " + this.lobbyQueue.length);
		
		return lobbyA;
    }

    private getAvailableLobby(lobbyToSkip: ILobby, numPlayers: number): ILobby | undefined {
        return this.lobbyQueue.find( (element) => {
			if(element !== lobbyToSkip) {
				return element.getAvailableSlots() >= numPlayers;
			}
			return false;
		});
    }

}
