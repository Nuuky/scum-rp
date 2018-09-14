'use strict'

const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class kickGrp {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(groupe, arg) {
        const msg = this.msg
        const bot = this.bot

        Global.Fn.waitFor(Global.Fn.findData("findOne", "user_info", {name: arg}))
        .then(user => {
            
        })

//         if(!pending[arg]) return Global.Msg.Send(msg, "L'index spécifier ne correspond à aucun joueur.")

//         Global.Fn.waitFor(Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {$set : {[`members.${user.index}`]: {pending: false}}}))
//         .then(() => {
//             bot.users.get(user.id).send("Vous avez été accepté dans: `" + Global.Fn.capitalize(groupe.name) + "`")
//         })
    }
}