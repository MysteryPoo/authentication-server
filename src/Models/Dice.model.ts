
import { Document, Model, model, Types, Schema } from "mongoose";

const DiceSchema : Schema = new Schema({
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
    },
    visible: {
        type: Boolean,
        required: true
    }
});

export interface IDice extends Document {
    requiredLevel: number;
    creditCost: number;
    premiumCost: number;
    uri: string;
    visible: boolean;
}

export default model<IDice>('Dice', DiceSchema);
