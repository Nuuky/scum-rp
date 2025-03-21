'use strict'

const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class acceptGrp {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(groupe, arg) {
        const msg = this.msg
        const bot = this.bot

        if(isNaN(arg)) return Global.Msg.Send(msg, "Vous devez spécifier l'index du membre à accepter.")

        let pending = [];
        let members = groupe.members

        members.forEach((member, index) => {
            if(member.pending) pending.push({"data": member, "index": index})
        });

        if(!pending[arg]) return Global.Msg.Send(msg, "L'index spécifier ne correspond à aucun joueur.")

        const user = pending[arg]
        console.log("user data: ", user.data)
      
        
        for( var i = 0; i < members.length-1; i++){
            if(members[i].id == user.data.id) members[i].pending = false;
        }

            
        Global.Fn.waitFor(Global.Fn.mongUpdate({_id: groupe._id, "members.id": user.data.id}, "update", "groupe_info", {$set: {"members.$.pending": false}}))
        .then(() => {
            bot.users.get(user.data.id).send("Vous avez été accepté dans le groupe: `" + Global.Fn.capitalize(groupe.name) + "`")
            Global.Msg.send(msg, "Utilisateur acceptés.")
        })
    }
}