
import { Socket, createServer, Server as netServer } from "net";
import { Client } from "./Client";

export class Server extends netServer {
    protected socketList : Array<Client>;

    private port : number;

    constructor() {
        super();
        this.socketList = [];
        this.port = 0;
        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketList = [];
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
            this.port = port;
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

    private onConnection( rawSocket : Socket) {
        const socket = new Client(rawSocket);
        this.socketList.push(socket);
    }

}
