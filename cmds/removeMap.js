'use strict'

const Global = require('../global/')
const Json = require("../json/")

module.exports = class RemoveMapCommand {

    constructor(msg) {
        this.msg = msg;
    }

    async run(query) {
        const msg = this.msg


        let mapTargetID;
        Json.grw.maps.forEach((map, index) => {
            for(let lang in map.name) {
                if(map.name[lang] == query) {
                    return mapTargetID = index;
                }
            }
        });

        if(!mapTargetID) return Global.Msg.reply(msg, "Map introuvable.")

        Json.grw.maps.splice(mapTargetID, 1);
        Global.Fn.upJSON("grw", Json.grw);

        Global.Msg.reply(msg, `${query} retiré.`)
    }
}