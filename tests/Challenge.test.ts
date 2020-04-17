
import { expect } from "chai";
import { AuthenticationChallenge } from "../src/Protocol/GameClientInterface/Challenge";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

describe("AuthenticationChallenge", () => {

    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 6;
        let salt : string = "This is an example salt string.";
        let saltLength : number = Buffer.byteLength(salt, 'utf8');
        let bufferSize : number = expectedSize + saltLength;
        let truth : Buffer = Buffer.allocUnsafe(bufferSize);
        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(bufferSize, 1);
        truth.writeUInt8(saltLength, 5);
        truth.write(salt, 6, salt.length, 'utf8');

        // Instatiate test instance
        let authChallenge : AuthenticationChallenge = new AuthenticationChallenge(messageId);
        authChallenge.salt = salt;
        let buffer : Buffer = authChallenge.serialize();
        
        expect(buffer.equals(truth)).to.be.true;
        done();
    });

    it("should fail to deserialize", (done) => {
        // Setup truth
        let id : string = "ABCD1234EFG";
        let truth : Buffer = Buffer.allocUnsafe(1 + id.length);
        truth.writeUInt8(id.length, 0);
        truth.write(id, 1, id.length, 'utf8');

        let authChallenge : AuthenticationChallenge = new AuthenticationChallenge(1);

        expect(authChallenge.deserialize.bind(authChallenge, truth)).to.throw("Method not implemented");
        
        done();
    });

});
