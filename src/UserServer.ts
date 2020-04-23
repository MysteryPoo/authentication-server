
import { IServer } from "./Interfaces/IServer";
import { Socket } from "net";
import { Client } from "./Client";
import { IClient } from "./Interfaces/IClient";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { AuthenticationChallenge } from "./Protocol/GameClientInterface/Messages/Challenge";
import { PingHandler } from "./Protocol/Common/Ping";
import { HandshakeHandler } from "./Protocol/GameClientInterface/Handlers/Handshake";
import { SetVisibleUsernameHandler } from "./Protocol/GameClientInterface/Handlers/SetVisibleUsername";
import { ServerBase } from "./Abstracts/ServerBase";
import { LobbyManager } from "./LobbyManager";
import { ILobby } from "./Interfaces/ILobby";
import { NewLobbyHandler } from "./Protocol/GameClientInterface/Handlers/NewLobby";
import { UpdateLobbyDataHandler } from "./Protocol/GameClientInterface/Handlers/UpdateLobbyData";
import { LobbyPlayerHandler } from "./Protocol/GameClientInterface/Handlers/LobbyPlayer";
import { GetPublicPlayerInfoHandler } from "./Protocol/GameClientInterface/Handlers/GetPublicPlayerInfo";
import { GetDashboardHandler } from "./Protocol/GameClientInterface/Handlers/GetDashboard";
import { PurchaseAvatarByIdHandler } from "./Protocol/GameClientInterface/Handlers/PurchaseAvatarById";
import { GetAvatarListHandler } from "./Protocol/GameClientInterface/Handlers/GetAvatarList";
import { SetAvatarHandler } from "./Protocol/GameClientInterface/Handlers/SetAvatar";
import { SetDiceHandler } from "./Protocol/GameClientInterface/Handlers/SetDice";
import { GetDiceListHandler } from "./Protocol/GameClientInterface/Handlers/GetDiceList";
import { PurchaseDiceByIdHandler } from "./Protocol/GameClientInterface/Handlers/PurchaseDiceById";
import { GetFriendListHandler } from "./Protocol/GameClientInterface/Handlers/GetFriendList";
import { FriendRequestHandler } from "./Protocol/GameClientInterface/Handlers/FriendRequest";
import { UserSearchHandler } from "./Protocol/GameClientInterface/Handlers/UserSearch";

export enum MESSAGE_ID {
    FIRST,
    "Challenge" = FIRST,
    "Handshake",
    "Ping",
    "MessageInfo",
    "NewLobby",
    "UpdateLobbyData",
    "LobbyData" = UpdateLobbyData, // Deprecated
    "StartGane",
    "JoinLobby",
    "GetFriends",
    "SetVisibleUsername",
    "FriendRequest",
    "GetMessages",
    "SetMessage",
    "UserSearch",
    "LobbyPlayer",
    "GetDashboard",
    "GetNextBattleReport",
    "GetPublicPlayerInfo",
    "GetAvatarList",
    "PurchaseAvatarById",
    "AcquireAvatar" = PurchaseAvatarById, // Deprecated
    "SetAvatar",
    "GetNextAward",
    "GetDiceList",
    "PurchaseDiceById",
    "AcquireDice" = PurchaseDiceById, // Deprecated
    "SetDice",
    INVALID,
    LAST = INVALID
};

export class UserServer extends ServerBase implements IServer {

    public handlerList : Array<IMessageHandler> = [];

    private port : number = 0;

    constructor(readonly lobbyMgr : LobbyManager) {
        super();
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.Handshake, HandshakeHandler);
        this.registerHandler<PingHandler>(MESSAGE_ID.Ping, PingHandler);
        this.registerHandler<SetVisibleUsernameHandler>(MESSAGE_ID.SetVisibleUsername, SetVisibleUsernameHandler);
        this.registerHandler<NewLobbyHandler>(MESSAGE_ID.NewLobby, NewLobbyHandler);
        this.registerHandler<UpdateLobbyDataHandler>(MESSAGE_ID.LobbyData, UpdateLobbyDataHandler);
        this.registerHandler<LobbyPlayerHandler>(MESSAGE_ID.LobbyPlayer, LobbyPlayerHandler);
        this.registerHandler<GetPublicPlayerInfoHandler>(MESSAGE_ID.GetPublicPlayerInfo, GetPublicPlayerInfoHandler);
        this.registerHandler<GetDashboardHandler>(MESSAGE_ID.GetDashboard, GetDashboardHandler);
        this.registerHandler<PurchaseAvatarByIdHandler>(MESSAGE_ID.PurchaseAvatarById, PurchaseAvatarByIdHandler);
        this.registerHandler<PurchaseDiceByIdHandler>(MESSAGE_ID.PurchaseDiceById, PurchaseDiceByIdHandler);
        this.registerHandler<GetAvatarListHandler>(MESSAGE_ID.GetAvatarList, GetAvatarListHandler);
        this.registerHandler<GetDiceListHandler>(MESSAGE_ID.GetDiceList, GetDiceListHandler);
        this.registerHandler<SetAvatarHandler>(MESSAGE_ID.SetAvatar, SetAvatarHandler);
        this.registerHandler<SetDiceHandler>(MESSAGE_ID.SetDice, SetDiceHandler);
        this.registerHandler<GetFriendListHandler>(MESSAGE_ID.GetFriends, GetFriendListHandler);
        this.registerHandler<FriendRequestHandler>(MESSAGE_ID.FriendRequest, FriendRequestHandler);
        this.registerHandler<UserSearchHandler>(MESSAGE_ID.UserSearch, UserSearchHandler);
        
        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketMap.clear();
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
            this.port = port;
            this.listen( {port: port, host: "0.0.0.0"}, () => {
                resolve(true);
            });
        });
    }

    public async stop(): Promise<boolean> {
        console.log("Stopping server...");
        return new Promise<boolean>( (resolve, reject) => {
            this.close(() => {
                console.log("Server shutdown.");
                resolve(true);
            });
        });
    }

    private onConnection( rawSocket : Socket) {
        const client = new Client(rawSocket, this);
        this.socketMap.set(client.uid, client);

        let message : AuthenticationChallenge = new AuthenticationChallenge(MESSAGE_ID.Challenge);
        message.salt = "ABCD";
        client.write(message.serialize());
    }

    public removeClient(client : IClient) : void {
        let lobby : ILobby | undefined = this.lobbyMgr.getLobbyOfClient(client);
        if (lobby) {
            lobby.removePlayer(client);
        }
        this.socketMap.delete(client.uid);
        client.destroy();
    }

    public authenticateClient(newId : string, client : IClient) : void {
        this.socketMap.set(newId, client);
        this.socketMap.delete(client.uid);
        client.authenticated = true;
    }

    public getAuthenticatedUsersCount() : number {
        return this.socketMap.size;
    }

    public getClientById(id : string) : IClient | undefined {
        return this.socketMap.get(id);
    }

}
