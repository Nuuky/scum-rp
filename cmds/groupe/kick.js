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
        
        let members = groupe.members

        Global.Fn.waitFor(Global.Fn.findData("findOne", "user_info", {name: arg}))
        .then(user => {
            if(!user) return Global.Msg.send(msg, "Ce joueur n'existe pas.")
            
            let changeBool = false;
            members.forEach(member => {
                if(member.id == user._id) changeBool = true
            })
            if(!changeBool) return Global.Msg.send(msg, "Ce joueur ne fait pas partis de votre groupe.")

            Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {$pull: { "members": { id: user._id}}})
            Global.Fn.mongUpdate({_id: user._id}, "update", "user_info", {$set: {"groupe": false} })
            bot.users.get(user._id).send("Vous avez été kick de: `" + groupe.name + "`")
            console.log("User: " + user.name + " has been kicked.");
            
        })
    }
}