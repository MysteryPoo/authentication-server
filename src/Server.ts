
import { Socket, createServer, Server as netServer } from "net";

export class Server {
    private socketList: Array<Socket>;
    private server: netServer;

    constructor() {
        this.socketList = [];
        this.server = createServer();
        this.server.on('connection', (socket: Socket) => {
            this.socketList.push(socket);
        });
        this.server.on('close', () => {
            this.socketList = [];
            console.log("Server no longer listening...");
        });
        this.server.on('listening', () => {
            console.log("Listening...");
        });
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
            this.server.listen( {port: port, host: "0.0.0.0"}, () => {
                resolve(true);
            });
        });
    }

    public async stop(): Promise<boolean> {
        console.log("Stopping server...");
        return new Promise<boolean>( (resolve, reject) => {
            this.server.close(() => {
                console.log("Server shutdown.");
                resolve(true);
            });
        });
    }

    public get listening(): boolean {
        return this.server.listening;
    }

}
