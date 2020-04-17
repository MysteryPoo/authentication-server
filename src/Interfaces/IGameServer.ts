
import { ISocket } from "./ISocket";

export enum STATE {
	"Available",
	"Notified",
	"Ready",
	"Dead"
};

export interface IGameServer extends ISocket {
    domain : string;
	port : number;
	webSocketPort : number;
	state : STATE;
	gameVersion : number;
}
