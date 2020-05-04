
import { IClient } from "./IClient";

export interface IConnectionManager {

    handleDisconnect(client : IClient) : void;

}
