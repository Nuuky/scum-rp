'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchGroupe {

    static run(msg, religion) {
        let info= {};
      
        Global.Fn.waitFor(Global.Fn.findData("find", "user_info", {religion: ObjectId(religion._id)}))
        .then((members) => {
          
            // Members field
            let membersList = "", pending = "", leader = "";
            members.forEach(member => {
                if(member.id == religion.leader) leader = "**" + member.name + "** 🌟";
                // else if(member.pending) pending += "*" + member.name + "* (En attente)\n"
                else membersList += `- ${member.name}\n`
            })
            const membersField = {
                "name": "Membres",
                "value": membersList
            }
            

            if(religion.goal) info.desc += "But: `" + religion.goal + "`\n"
            if(religion.city) info.desc += "Ville: `" + religion.city + "`\n"

            // Common Infos
            info.color = Global.Fn.hostilityColor(religion.hostility);
            info.logo = (religion.logo) ? religion.logo : null;


            const embed = {
                "title":  "**" + Global.Fn.capitalize(religion.name) + "** *(" + religion.members.length + " membre" + ((religion.members.length > 1) ? "s" : "") + ")*",
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
                        "value" : religion.description
                    }
                ]
            }

            Global.Msg.embed(msg, embed, 180);
        })
        .catch(err => console.error(err))
    };
}