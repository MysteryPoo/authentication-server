
import { expect } from "chai";
import { SetVisibleUsername } from "../src/Messages/AccountInfo";

describe("SetVisibleUsername", () => {

    it("should fail to serialize", (done) => {
        let setVisibleUsername : SetVisibleUsername = new SetVisibleUsername(1);

        expect(setVisibleUsername.serialize.bind(setVisibleUsername)).to.throw("Method not implemented.");
        done();
    });

    it("should deserialize to a valid url if valid buffer received", (done) => {
        // Setup truth
        let id : string = "ABCD1234EFG";
        let truth : Buffer = Buffer.allocUnsafe(1 + id.length);
        truth.writeUInt8(id.length, 0);
        truth.write(id, 1, id.length, 'utf8');

        let setVisibleUsername : SetVisibleUsername = new SetVisibleUsername(1);
        setVisibleUsername.deserialize(truth);

        expect(setVisibleUsername.username).to.equal(id);
        
        done();
    });

    it("should catch error for poorly formatted data", (done) => {
        let lie = Buffer.allocUnsafe(32);

        let setVisibleUsername : SetVisibleUsername = new SetVisibleUsername(1, lie);

        expect(setVisibleUsername.valid).to.be.false;

        done();
    });

});
