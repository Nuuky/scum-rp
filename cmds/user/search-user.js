'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchUserCommand {

    static run(msg, user) {
        let info= {}, groupe;

        Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {_id: ObjectId(user.groupe)}))
        .then((groupeInfo) => {
            groupe = groupeInfo;
            Global.Fn.waitFor(Global.Fn.findData("findOne", "religion_info", {_id: ObjectId(user.religion)}))
        })
        .then((religion) => {

            // console.log("then User: ", user);
            // console.log("then Religion: ", religion);
            // console.log("then Groupe: ", groupe);

            info.desc = "**Sexe:** `" + ((user.style.sex == 0) ? "Homme" : "Femme") + "`\n"
            info.desc += "**Age:** `" + user.age + "`\n"
            info.desc += "**Métier:** `" + ((user.job) ? user.job : "Vagabond") + "`\n"
            // info.desc += "**Groupe:** `" + ((groupe) ? (groupe.name + ((groupe.leader == user._id) ? "` 👑" : "`")) : "Aucun groupe`") + "\n"
            // info.desc += "**Religion:** `" + ((religion) ? (religion.name + ((religion.leader == user._id) ? "` 🌟" : "`")) : "Athés`") + "\n"

            // Common Infos
            info.title = "'" + user.name + "'";
            info.color = Global.Fn.hostilityColor(user.hostility);
            info.image = (user.image) ? user.image : "null";

            let defImage = Json.scumData.charStyle[user.style.sex][user.style.head][user.style.tatoo];
            let image = (user.url) ? user.url : defImage;

            let crimes = "";
            user.crimes.forEach(crime => {
                crimes += `\`${crime}\` `
            })

            const embed = {
                "title":  "**" + user.name + "**",
                "description": info.desc,
                "color": info.color,
                "thumbnail": {
                    "url": image
                },
                "fields": [
                    {
                        "name": "Crimes",
                        "value": crimes,
                        "inline": true
                    },
                    {
                        "name": "Appartenance",
                        "value": `**Groupe:** \` ${((groupe) ? (groupe.name + ((groupe.leader == user._id) ? "` 👑" : "`")) : "Aucun groupe`")}
                        **Religion:** \` ${((religion) ? (religion.name + ((religion.leader == user._id) ? "`" : "` 🌟")) : "Athés`")}`,
                        "inline": true
                    }
                ]
            }



            // Get Background Story
            if(user.background) {
                embed["fields"] = [
                    {
                        "name": "Background",
                        "value" : user.background,
                        "inline": false
                    }
                ];
            }

            Global.Msg.embed(msg, embed, 180);
        })
        .catch(err => console.error(err))
    };
}