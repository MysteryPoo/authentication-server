
import { Socket } from "net";

export class Message {

    public socket : Socket;
    public message : Buffer;

    constructor(socket : Socket, message : Buffer) {
        this.socket = socket;
        this.message = message;
    }
    
};