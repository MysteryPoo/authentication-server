
import { Document, Model, model, Types, Schema } from "mongoose";
import { v4 as uuid} from "uuid";

// Schema
const UserSchema : Schema = new Schema({
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    avatarUri: {
        type: String,
        required: false
    },
    diceUri: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    active: Boolean,
    isAdmin: Boolean,
    device_uuid: {
        type: String,
        required: false,
        default: uuid()
    },
    experience: Number,
    level: Number,
    credits: Number,
    premium: Number,
    conquest: Number,
    rating: Number,
    rank: Number,
    avatarList: [{type: Schema.Types.ObjectId}],
    diceList: [{type: Schema.Types.ObjectId}],
    shipSkinList: [{type: Schema.Types.ObjectId}],
    friendList: [{type: Schema.Types.ObjectId}],
    messageList: [{type: Schema.Types.ObjectId}],
    pendingBattleReports: [{type: Schema.Types.ObjectId}],
    pendingAwards: [{type: Schema.Types.ObjectId}]
});

// Interface
interface IUserSchema extends Document {
    password : string,
    salt : string,
    username : string,
    avatarUri : string,
    diceUri? : string,
    email : string,
    created : Date,
    last_login : Date,
    active : boolean,
    isAdmin : boolean,
    device_uuid : string,
    experience : number,
    level : number,
    credits : number,
    premium : number, // Old rares
    conquest? : number,
    rating : number,
    rank : number,
    avatarList : Types.Array<Types.ObjectId>,
    diceList? : Types.Array<Types.ObjectId>,
    shipSkinList? : Types.Array<Types.ObjectId>,
    friendList : Types.Array<Types.ObjectId>,
    messageList : Types.Array<Types.ObjectId>,
    pendingBattleReports? : Types.Array<Types.ObjectId>,
    pendingAwards? : Types.Array<Types.ObjectId>
}

interface IUserBase extends IUserSchema {

}

export interface IUser extends IUserBase {

}

export interface IUserModel extends Model<IUser> {

}

export default model<IUser, IUserModel>('User', UserSchema);
