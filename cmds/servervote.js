'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class SerVoteCommand {

    constructor(msg) {
        this.msg = msg;
    }

    async run(query) {
        const q = Number(query)
        console.log(q)
        Json.guilds[this.msg.guild.id].voteRef = (q > 0) ? q + 1 : q;
        let chanVote = 0;
        for(chan in Json.guilds[this.msg.guild.id].channels) {
            if(Json.guilds[this.msg.guild.id].channels[chan]) {
                chanVote++
            }
        }
        Json.guilds[this.msg.guild.id].voteCap = (q > 0) ? (q + 1 - chanVote): q;
        Global.Fn.upJSON("guilds", Json.guilds);
    }
}