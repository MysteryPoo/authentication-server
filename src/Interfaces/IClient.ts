
import { ISocket } from "./ISocket";

export interface IClient extends ISocket {
    uid : string;
    authenticated : boolean;
    isReady : boolean;
    gameVersion : number;
}
