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

        groupe.members.forEach((member, index) => {
            if(member.pending) pending.push({"data": member, "index": index})
        });

        if(!pending[arg]) return Global.Msg.Send(msg, "L'index spécifier ne correspond à aucun joueur.")

        const user = pending[arg]

        Global.Fn.waitFor(Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {[`members.${user.index}`]: {$set: {pending: false}}}))
        .then(() => {
            bot.users.get(user.id).send("Vous avez été accepté dans: `" + Global.Fn.capitalize(groupe.name) + "`")
        })
    }
}