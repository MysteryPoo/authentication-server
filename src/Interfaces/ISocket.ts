
export interface ISocket {
    write(buffer : Buffer) : boolean;
    destroy() : void;
}
