
import { IClient } from "./IClient";

export enum STATE {
	Offline,
	Ready,
	Started
};

export interface IGameServer extends IClient {
	state : STATE;
	containerId : string;
}
