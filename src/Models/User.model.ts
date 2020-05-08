
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
        default: ""
    },
    diceUri: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    created: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    isAdmin: {type: Boolean, default: false},
    device_uuid: {
        type: String,
        required: false,
        default: uuid()
    },
    experience: {type: Number, default: 0},
    level: {type: Number, default: 1},
    credits: {type: Number, default: 0},
    premium: {type: Number, default: 0},
    conquest: {type: Number, default: 0},
    rating: {type: Number, default: 1400},
    rank: {type: Number, default: 1},
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
    diceUri : string,
    email : string,
    created : Date,
    last_login : Date,
    isAdmin : boolean,
    device_uuid : string,
    experience : number,
    level : number,
    credits : number,
    premium : number, // Old rares
    conquest : number,
    rating : number,
    rank : number,
    avatarList : Types.Array<Types.ObjectId>,
    diceList : Types.Array<Types.ObjectId>,
    shipSkinList? : Types.Array<Types.ObjectId>,
    friendList : Types.Array<Types.ObjectId>,
    messageList : Types.Array<Types.ObjectId>,
    pendingBattleReports : Types.Array<Types.ObjectId>,
    pendingAwards : Types.Array<Types.ObjectId>
}

interface IUserBase extends IUserSchema {
    
}

export interface IUser extends IUserBase {

}

export interface IUserModel extends Model<IUser> {

}

export default model<IUser, IUserModel>('User', UserSchema);
