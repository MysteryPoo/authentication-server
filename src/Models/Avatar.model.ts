
import { Document, Model, model, Types, Schema } from "mongoose";

const AvatarSchema : Schema = new Schema({
    requiredLevel: {
        type: Number,
        required: true
    },
    creditCost: {
        type: Number,
        required: true
    },
    premiumCost: {
        type: Number,
        required: true
    },
    uri: {
        type: String,
        required: true
    }
});

export interface IAvatar extends Document {
    requiredLevel: number;
    creditCost: number;
    premiumCost: number;
    uri: string;
}

export default model<IAvatar>('Avatar', AvatarSchema);
