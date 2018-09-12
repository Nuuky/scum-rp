'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchGroupe {

    static run(msg, groupe) {
        let info= {}, srchGrp, srchRel;
      
        console.log("Searching groupe info")
      
        console.log(groupe._id)
        Global.Fn.waitFor(Global.Fn.findData("find", "user_info", {groupe: "5b98fefecca38b18ed5c8a6c"}))
        .then((members) => {
          
            // Members field
            let membersList = "", pending = "", leader = "";
            console.log(members)
            members.forEach(member => {
                if(member.id == groupe.leader) leader = member.name;
                else if(member.pending) pending += "*" + member.name + "* (En attente)\n"
                else membersList += `- ${member.name}\n`
                console.log("Leader: " + leader + " // member: " + member)
            })
            const membersField = {
                "name": "Membres",
                "value": membersList
            }
            

            info.desc = "Activité: `" + groupe.activity+ "`\n"
            if(groupe.goal) info.desc += "But: `" + groupe.goal + "`\n"
            if(groupe.city) info.desc += "Ville: `" + groupe.city + "`\n"

            // Common Infos
            info.color = Global.Fn.hostilityColor(groupe.hostility);
            info.logo = (groupe.logo) ? groupe.logo : null;


            const embed = {
                "title":  "**" + Global.Fn.capitalize(groupe.name) + "** *(" + groupe.members.length + " membre" + ((groupe.members.length > 1) ? "s" : "") + ")*",
                "color": info.color,
                "thumbnail": {
                    "url": info.logo
                },
                "fields": [
                    {
                        "name": "Informations",
                        "value": info.desc,
                        "inline": true
                    },
                    {
                        "name": "Membres",
                        "value": "**" + leader + "** 👑\n" + membersList + pending,
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