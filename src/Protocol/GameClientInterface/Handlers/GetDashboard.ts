
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import UserModel, { IUser } from "../../../Models/User.model";
import { GetDashboard } from "../Messages/GetDashboard";
import { UserServerManager } from "../../../UserServerManager";

export class GetDashboardHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        if (myClient.authenticated) {
            UserModel.findById(myClient.uid).select({level: 1, credits: 1, rares: 1, conquest: 1, pendingAwards: 1, pendingBattleReports: 1}).exec( (err, user : IUser) => {
                if (err) console.error(err);
                
                this.respond(myClient, user);
            });
            return true;
        } else {
            return false;
        }
    }

    respond(myClient : IClient, user : IUser) {
        let myServer : UserServerManager = myClient.connectionManager as UserServerManager;
        let response : GetDashboard = new GetDashboard(this.messageId);
        response.onlinePlayers = myServer.getAuthenticatedUsersCount();
        response.lookingPlayers = myServer.lobbyMgr.lobbyQueue.length; // This is wrong ... This is just number of lobbies in queue
        response.conquest = user.conquest;
        response.credits = user.credits;
        response.level = user.level;
        response.pendingAwards = user.pendingAwards.length > 0;
        response.pendingReports = user.pendingBattleReports.length > 0;
        response.rares = user.premium;
        
        myClient.write(response.serialize());
    }
    
}
