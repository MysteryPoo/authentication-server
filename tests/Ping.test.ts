
import { expect } from "chai";
import { Ping } from "../src/Messages/Ping";

function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}

describe("Ping", () => {

    it("should serialize into a valid buffer", (done) => {
        // Setup truth
        let messageId : number = getRandomInt(255);
        let expectedSize : number = 9;
        let timeValue : number = getRandomInt(65535);
        let truth : Buffer = Buffer.allocUnsafe(expectedSize);
        truth.writeUInt8(messageId, 0);
        truth.writeUInt32LE(expectedSize, 1);
        truth.writeUInt32LE(timeValue, 5);

        // Instatiate test instance
        let ping : Ping = new Ping(messageId);
        ping.time = timeValue;
        let buffer : Buffer = ping.serialize();
        
        expect(buffer.equals(truth)).to.be.true;
        done();
    });

    it("should deserialize to a valid time value if valid buffer received", (done) => {
        // Setup truth
        let timeValue : number = getRandomInt(65535);
        let truth : Buffer = Buffer.allocUnsafe(4);
        truth.writeUInt32LE(timeValue, 0);

        let ping : Ping = new Ping(1, truth);
        ping.deserialize(truth);

        expect(ping.time).to.equal(timeValue);
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let ping : Ping = new Ping(1, lie);

        expect(ping.valid).to.be.false;

        done();
    });

});
