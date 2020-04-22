import AvatarModel, { IAvatar } from "./Models/Avatar.model";
import DiceModel, { IDice } from "./Models/Dice.model";

export class DatabaseUtility {
    public static fillAvatars() : void {
        
        AvatarModel.find().exec( (err, avatarList : Array<IAvatar>) => {
            if (err) console.error(err);
            if (avatarList.length === 0) {
                console.debug("No avatars found in database... Filling with defaults.");
                let avatarsToInsert : Array<IAvatar> = [];
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 50,
                    premiumCost: 0,
                    visible: true,
                    uri: "profile-generic-male2-1.jpg"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 0,
                    premiumCost: 30,
                    visible: true,
                    uri: "profile-generic-male-31.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 10,
                    premiumCost: 0,
                    visible: true,
                    uri: "profile-alpha-blue-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 30,
                    premiumCost: 5,
                    visible: true,
                    uri: "profile-alpha-blue2-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 10,
                    premiumCost: 0,
                    visible: true,
                    uri: "profile-alpha-green-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 30,
                    premiumCost: 5,
                    visible: true,
                    uri: "profile-alpha-green2-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 10,
                    premiumCost: 0,
                    visible: true,
                    uri: "profile-alpha-red-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 30,
                    premiumCost: 5,
                    visible: true,
                    uri: "profile-alpha-red2-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 5,
                    creditCost: 0,
                    premiumCost: 0,
                    visible: true,
                    uri: "profile-alpha-white-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 10,
                    premiumCost: 0,
                    visible: true,
                    uri: "profile-alpha-yellow-1.png"
                }));
                avatarsToInsert.push(new AvatarModel({
                    requiredLevel: 1,
                    creditCost: 30,
                    premiumCost: 5,
                    visible: true,
                    uri: "profile-alpha-yellow2-1.png"
                }));

                AvatarModel.insertMany(avatarsToInsert);
            }
        });

        DiceModel.find().exec( (err, diceList : Array<IDice>) => {
            if (err) console.error(err);
            if (diceList.length === 0) {
                console.debug("No dice found in database... Filling with defaults.");
                let diceToInsert : Array<IDice> = [];

                diceToInsert.push(new DiceModel({
                    requiredLevel: 1,
                    creditCost: 10,
                    premiumCost: 0,
                    visible: true,
                    uri: "dice-base-alpha-1.png"
                }));

                DiceModel.insertMany(diceToInsert);
            }
        });

    }
}
