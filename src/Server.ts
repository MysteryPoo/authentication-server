
import { Socket, createServer, Server as netServer } from "net";
import { Message } from "./Message";

export class Server extends netServer {
    protected socketList : Array<Socket>;
    protected messageQueue : Array<Message>;

    constructor() {
        super();
        this.socketList = [];
        this.messageQueue = [];
        this.on('connection', (socket: Socket) => {
            this.socketList.push(socket);
            socket.on('data', (data: Buffer) => {
                let index = this.socketList.findIndex( (value: Socket) => {
                    return value === socket;
                });
                console.log("Data from socket: " + index);
                console.log(data);
                this.messageQueue.push(new Message(socket, data));
            });
        });
        this.on('close', () => {
            this.socketList = [];
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening...");
        });
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
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

    public messagePop() : Message | undefined {
        return this.messageQueue.pop();
    }

}
