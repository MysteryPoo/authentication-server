
import { Document, Model, model, Types, Schema } from "mongoose";

const MessageSchema : Schema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: false
    },
    senderName: {
        type: String,
        required: true
    },
    isUnread: {
        type: Boolean,
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

export interface IMessage extends Document {
    sender : Types.ObjectId;
    senderName : string;
    isUnread : boolean;
    recipient : Types.ObjectId;
    subject : string;
    message : string;
}

export default model<IMessage>('Message', MessageSchema);
