
import { expect } from "chai";
import { AcquireAvatar } from "../src/Messages/AcquireAvatar";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

describe("AcquireAvatar", () => {

    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 6;
        let url : string = "http://test.url.not.a.real.domain/";
        let urlLength : number = Buffer.byteLength(url, 'utf8');
        let bufferSize : number = expectedSize + urlLength;
        let truth : Buffer = Buffer.allocUnsafe(bufferSize);
        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(bufferSize, 1);
        truth.writeUInt8(urlLength, 5);
        truth.write(url, 6, url.length, 'utf8');

        // Instatiate test instance
        let acquireAvatar : AcquireAvatar = new AcquireAvatar(messageId);
        acquireAvatar.url = url;
        let buffer : Buffer = acquireAvatar.serialize();
        
        expect(buffer.equals(truth)).to.be.true;
        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : string = "ABCD1234EFG";
        let truth : Buffer = Buffer.allocUnsafe(1 + id.length);
        truth.writeUInt8(id.length, 0);
        truth.write(id, 1, id.length, 'utf8');

        let acquireAvatar : AcquireAvatar = new AcquireAvatar(1, truth);
        acquireAvatar.deserialize(truth);

        expect(acquireAvatar.id).to.equal(id);
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let acquireAvatar : AcquireAvatar = new AcquireAvatar(1, lie);

        expect(acquireAvatar.valid).to.be.false;

        done();
    });

});
