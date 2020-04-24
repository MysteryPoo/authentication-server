
import { IClient } from "./IClient";

export enum STATE {
	"Available",
	"Notified",
	"Ready",
	"Dead"
};

export interface IGameServer extends IClient {
	state : STATE;
}
