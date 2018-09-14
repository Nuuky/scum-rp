'use strict'

const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class rejectGrp {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot= bot
    }

    async run(groupe, arg) {
        const msg = this.msg
        const bot = this.bot

        if(isNaN(arg)) return Global.Msg.Send(msg, "Vous devez spécifier l'index du membre à accepter.")

        let members = groupe.members;
        let pending = [];

        groupe.members.forEach((member, index) => {
            if(member.pending) pending.push({"data": member, "index": index})
        });

        if(!pending[arg]) return Global.Msg.Send(msg, "L'index spécifier ne correspond à aucun joueur.")

        const user = pending[arg]

        for( var i = 0; i < members.length-1; i++){
            if(i == user.index) members.splice(i, 1);
        }

        Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {members: members})
        bot.users.get(user.data.id).send("Vous n'avez pas été accepté par: `" + groupe.name + "`")
    }
}