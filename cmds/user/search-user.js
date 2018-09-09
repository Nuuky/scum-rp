'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchUserCommand {

    static run(msg, user) {
        let info= {}, groupe, srchGrp, srchRel;
      
        if(user.groupe) srchGrp = Global.Fn.findData("findOne", "groupe_info", {_id: ObjectId(user.groupe.id)})
        else srchGrp = null
      
        Global.Fn.waitFor(srchGrp)
        .then((groupeInfo) => {
            groupe = groupeInfo;
            if(user.religion) srchRel = Global.Fn.findData("findOne", "religion_info", {_id: ObjectId(user.religion.id)})
            else srchRel = null
            return Global.Fn.waitFor(srchRel)
        })
        .then((religion) => {


            info.desc = "**Sexe:** `" + ((user.style.sex == 0) ? "Homme" : "Femme") + "`\n"
            info.desc += "**Age:** `" + user.age + "`\n"
            info.desc += "**Métier:** `" + ((user.job) ? user.job : "Vagabond") + "`\n"

            // Common Infos
            info.title = "'" + user.name + "'";
            info.color = Global.Fn.hostilityColor(user.hostility);
            info.image = (user.image) ? user.image : "null";

            let defImage = Json.scumData.charStyle[user.style.sex][user.style.head][user.style.tatoo];
            let image = (user.url) ? user.url : defImage;
            
            let crimes = "";
            if(user.crimes) {
                user.crimes.forEach(crime => {
                    crimes += `\`${crime}\` `
                })
            } else {
                crimes = "`Innocent`"
            }
            
            let dispGrp = "";
            if(groupe) {
                groupe.members.forEach(member => {
                    if((member.id == user.id) && (member.pending)) {
                        dispGrp = "`En attente`"
                        //return 
                    } else {
                        dispGrp = "`" + Global.Fn.capitalize(groupe.name) + ((groupe.leader == user._id) ? "` 👑" : "`")
                        //return 
                    }
                })
            } else {
                dispGrp = "`Aucun`"
            }


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
                        "value": `**Groupe:** ${dispGrp}
                        **Religion:** \` ${((religion) ? (Global.Fn.capitalize(religion.name) + ((religion.leader == user._id) ? "` 🌟" : "`")) : "Athés`")}`,
                        "inline": true
                    }
                ]
            }



            // Get Background Story
            if(user.description) {
                 embed["fields"].push(
                    {
                        "name": "Background",
                        "value" : user.description
                    }
                 )
            }

            Global.Msg.embed(msg, embed, 180);
        })
        .catch(err => console.error(err))
    };
}