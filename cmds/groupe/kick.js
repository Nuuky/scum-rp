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
            for( var i = 0; i < members.length-1; i++){
                if(members.name == arg) members.splice(i, 1);
            }
            if(!changeBool) return Global.Msg.send(msg, "Ce joueur ne fait pas partis de votre groupe.")

            Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {members: members})
            bot.users.get(user._id).send("Vous avez été kick de: `" + groupe.name + "`")
            
        })
    }
}