'use strict'

const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class pendingGrp {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(groupe, arg) {
        const msg = this.msg
        const bot = this.bot
        
        let pending = []
        
        groupe.members.forEach(member => {
            if(member.pending) pending.push(member)
        })
        
        let pendingList = (pending.length > 0) ? "" : "Aucun"
        
        pending.forEach((member, index) => {
            pendingList += "`" + index + "`: " + Global.Fn.getNick(msg, member.id) + "\n"
        })
      
        const embed = {
            title: "Joueurs en attentes",
            description: "Liste des joueurs qui veulent rejoindre votre groupe",
            fields: [
                {
                    name: "Joueurs",
                    value: pendingList
                }
            ]
        }
        
        Global.Msg.embed(msg, embed)
    }
}