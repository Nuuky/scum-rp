'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchUserCommand {

    static run(msg, user) {
        let info= {}, groupe;

        const getGroupeInfo = () => {
            const promise = new Promise((resolve, reject) => {
                console.log("getGroupe -------")
                resolve(Global.Fn.findData("findOne", "groupe_info", {_id: ObjectId(user.groupe)}))
            })
            //console.log(promise)
            return promise
        }

        const getReligionInfo = (groupeInfo) => {
            groupe = groupeInfo;
            const promise = new Promise((resolve, reject) => {
                console.log("getReligion -------")
                resolve(Global.Fn.findData("findOne", "religion_info", {_id: ObjectId(user.religion)}))
            })
            //console.log(promise)
            return promise
        }

        getGroupeInfo()
        .then(getReligionInfo)
        .then((religion) => {

            // console.log("then User: ", user);
            // console.log("then Religion: ", religion);
            // console.log("then Groupe: ", groupe);

            console.log("sex: ", user.style.sex)

            info.desc = "**Sexe:** `" + ((user.style.sex == 1) ? "Homme" : "Femme") + "`\n"
            info.desc += "**Age:** `" + user.age + "`\n"
            info.desc += "**Job:** `" + ((user.job) ? user.job : "Vagabond") + "`\n"
            info.desc += "**Groupe:** `" + ((groupe) ? (groupe.name + ((groupe.leader == user._id) ? "` 👑" : "`")) : "Aucun groupe`") + "\n"
            info.desc += "**Religion:** `" + ((religion) ? (religion.name + ((religion.leader == user._id) ? "` 🌟" : "`")) : "Athés`") + "\n"

            console.log("Startin Embed...");

            // Common Infos
            info.title = "'" + user.name + "'";
            info.color = Global.Fn.hostilityColor(user.hostility);
            info.image = (user.image) ? user.image : "null";

            let defImage = Json.charStyle[user.style.head][user.style.tatoo];
            let image = (user.url) ? user.url : image;

            const embed = {
                "title":  "**" + user.name + "**",
                "description": info.desc,
                "color": info.color,
                "thumbnail": {
                    "url": image
                }
            }

            // Get Background Story
            if(user.background) {
                embed["fields"] = [
                    {
                        "name": "Background",
                        "value" : user.background,
                    }
                ];
            }

            Global.Msg.embed(msg, embed, 180);
        })
        .catch(err => console.error(err))
    };
}



/* 
    user: {
        "_id": "DiscordID",

        "name": "Nuri Kavasky",

        "age": 32,

        "style": {
            "sex": 1,
            "head": 1,
            "tatoo": 1,
        },

        "crime": "Vole",

        "job": "Chasseur / Paysan / Eleveur / Prêtre / ...", (opt)

        "hostility": "Amicale / Méfiant / Dangereux", (opt)

        "groupe": "$groupeID", (opt)

        "religion": "$religionID", (opt)

        "image": "https://i.gyazo.com/0023bb1e3275bccbd93c3727607c6152.png", (opt)

        "background": "Background du personnage" (opt)
    }
*/