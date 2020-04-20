
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class GetDashboard extends MessageBase {

    public onlinePlayers! : number;
    public lookingPlayers! : number;
    public level! : number;
    public credits! : number;
    public rares! : number;
    public conquest! : number;
    public pendingReports! : boolean;
    public pendingAwards! : boolean;

    serialize(): Buffer {
        let flags : number = 0;
        if (this.pendingReports) {
            flags |= 0b10;
        }
        if (this.pendingAwards) {
            flags |= 0b01;
        }

        let bufferSize = 23;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt16LE(this.onlinePlayers);
        helper.writeUInt16LE(this.lookingPlayers);
        helper.writeUInt8(this.level);
        helper.writeUInt32LE(this.credits);
        helper.writeUInt32LE(this.rares);
        helper.writeUInt32LE(this.conquest);
        helper.writeUInt8(flags);
        
        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }
    
}
