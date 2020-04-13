
import { Socket } from "net";

export class SocketMock extends Socket {
    write(buffer : Buffer) : boolean {
        return true;
    }
}
