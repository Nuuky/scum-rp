'use strict'

const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class acceptGrp {

    constructor(msg) {
        this.msg = msg;
    }

    async run(groupe, arg) {
        const msg = this.msg

        if(isNaN(arg)) return Global.Msg.Send(msg, "Vous devez spécifier l'index du membre à accepter.")

        let pending = [];

        groupe.members.forEach((member, index) => {
            if(member.pending) pending.push({"data": member, "index": index})
        });

        if(!pending[arg]) return Global.Msg.Send(msg, "L'index spécifier ne correspond à aucun joueur.")

        const idx = pending[arg].index.toString()

        Global.Fn.mongUpdate({_id: ObjectId(groupe._id)}, "update", "groupe_info", {$set : {[`members.${idx}`]: {pending: false}}})
    }
}