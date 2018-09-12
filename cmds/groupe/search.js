'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchGroupe {

    static run(msg, groupe) {
        let info= {}, srchGrp, srchRel;
      
        console.log("Searching groupe info")
      
        Global.Fn.waitFor(Global.Fn.findData("find", "user_info", {groupe: ObjectId(groupe._id)}))
        .then((members) => {
          
            // Members field
            let membersList = "", pending = "", leader;
            members.forEach(member => {
                if(member.id == groupe.leader) leader = member.name;
                else if(member.pending) pending = "*" + member.name + "* (En attente)\n"
                else membersList += `- ${member.name}\n`
            })
            const membersField = {
                "name": "Membres",
                "value": membersList
            }
            

            info.desc = "**Activité:** `" + groupe.activity+ "`\n"
            if(groupe.goal) info.desc += "**But:** `" + groupe.goal + "`\n"
            if(groupe.city) info.desc += "**Ville:** `" + groupe.city + "`\n"

            // Common Infos
            info.color = Global.Fn.hostilityColor(groupe.hostility);
            info.image = (groupe.logo) ? groupe.logo : null;


            const embed = {
                "title":  "**" + Global.Fn.capitalize(groupe.name) + "**",
                "description": info.desc,
                "color": info.color,
                "thumbnail": {
                    "url": info.logo
                },
                "fields": [
                    {
                        "name": "Membres (" + groupe.members.length + ")",
                        "value": "**" + leader + "** 👑\n" + members + pending,
                        "inline": true
                    },
                    {
                        "name": "Description",
                        "value" : groupe.description
                    }
                ]
            }

            Global.Msg.embed(msg, embed, 180);
        })
        .catch(err => console.error(err))
    };
}