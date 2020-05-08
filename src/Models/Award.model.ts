
import { Document, Model, model, Types, Schema } from "mongoose";

const AvatarSchema : Schema = new Schema({
    avatarId : {type : Schema.Types.ObjectId, required : true},
    avatarUri : {type : String, required : true}
})

const AwardSchema : Schema = new Schema({
    credits : {type : Number, required : true},
    premium : {type : Number, required : true},
    conquest : {type : Number, required : true},
    experience : {type : Number, required : true},
    avatar : {type : AvatarSchema, required : false}
});

interface IAvatar extends Document {
    avatarId : Types.ObjectId;
    avatarUri : string;
}

export interface IAward extends Document {
    credits : number;
    premium : number;
    conquest : number;
    experience : number;
    avatar : IAvatar;
}

export default model<IAward>('Award', AwardSchema);
