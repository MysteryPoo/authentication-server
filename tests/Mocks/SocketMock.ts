
export class SocketMock {

    public write(buffer : Buffer) : boolean {
        return true;
    }

    public destroy() : void {
        
    }

}