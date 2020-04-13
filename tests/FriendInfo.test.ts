
import { expect } from "chai";
import { AddRemoveFriend } from "../src/Messages/FriendInfo";
import { ObjectId } from "mongodb";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

describe("AddRemoveFriend", () => {

    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 8;
        let id : ObjectId = new ObjectId();
        let idLength : number = id.toHexString().length;
        let username : string = "testUsername";
        let usernameLength : number = username.length;
        let flags : number = 0;
        let online : boolean = true;
        let remove : boolean = false;
        if (online) {
            flags |= 0b01;
        }
        if (remove) {
            flags |= 0b10;
        }

        let bufferSize : number = expectedSize + idLength + usernameLength;
        let truth : Buffer = Buffer.allocUnsafe(bufferSize);

        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(bufferSize, 1);
        truth.writeUInt8(idLength, 5);
        truth.write(id.toHexString(), 6, id.toHexString().length, 'utf-8');
        truth.writeUInt8(usernameLength, 7 + idLength);
        truth.write(username, 8 + idLength, username.length, 'utf-8');
        truth.writeUInt8(flags, 9 + idLength + usernameLength);

        // Instatiate test instance
        let friend : AddRemoveFriend = new AddRemoveFriend(messageId);
        friend.id = id;
        let buffer : Buffer = friend.serialize();
        
        expect(buffer.equals(truth)).to.be.true;

        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : string = "ABCD1234EFG";
        let flags : number = 0b1;
        let truth : Buffer = Buffer.allocUnsafe(2 + id.length);
        truth.writeUInt8(id.length, 0);
        truth.write(id, 1, id.length, 'utf8');
        truth.writeUInt8(flags, 2 + id.length);

        let friend : AddRemoveFriend = new AddRemoveFriend(1, truth);

        expect(friend.id).to.equal(id);
        expect(friend.remove).to.be.true;
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let friend : AddRemoveFriend = new AddRemoveFriend(1, lie);

        expect(friend.valid).to.be.false;

        done();
    });

});
