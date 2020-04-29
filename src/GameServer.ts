
import { MESSAGE_ID } from "./GameServerServer";
import { IGameServer, STATE } from "./Interfaces/IGameServer";
import { ClientBase } from "./Abstracts/ClientBase";

export class GameServer extends ClientBase implements IGameServer {

    ValidateMessageId(identifier: number): boolean {
        return identifier >= MESSAGE_ID.FIRST && identifier <= MESSAGE_ID.LAST;
    }

    GetMessageTypeString(identifier: number): string {
        return MESSAGE_ID[identifier];
    }

    public state: STATE = STATE.Requested;
    public containerId : string = "";

}
