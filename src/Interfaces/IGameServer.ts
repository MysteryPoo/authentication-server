
import { IClient } from "./IClient";

export enum STATE {
	Requested,
	Offline,
	Ready,
	Started
};

export interface IGameServer extends IClient {
	state : STATE;
	containerId : string;
}
