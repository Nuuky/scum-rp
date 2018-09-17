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

        if(isNaN(arg)) return Global.Msg.Send(msg, "Vous devez spécifier l'index du membre à rejeter.")

        let members = groupe.members;
        let pending = [];

        groupe.members.forEach((member, index) => {
            if(member.pending) pending.push(member)
        });

        if(!pending[arg]) return Global.Msg.Send(msg, "L'index spécifier ne correspond à aucun joueur.")

        const user = pending[arg]


        Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {$pull: { "members": { id: user._id}}})
        Global.Fn.mongUpdate({_id: user.id}, "update", "user_info", {$set: {"groupe": false} })
        bot.users.get(user.data.id).send("Votre demande d'adhésion pour: `" + groupe.name + "` a été rejeté")
        Global.Msg.send(msg, "La demande a bien été rejeté.")
    }
}