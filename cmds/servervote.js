'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class SerVoteCommand {

    constructor(msg) {
        this.msg = msg;
    }

    async run(query) {
        const q = Number(query)
        const Guild = Global.Fn.monGuilDB({_id: this.msg.guild.id}, "find");
      
        Guild.voteRef = (q > 0) ? q + 1 : q;
        let chanVote = 0;
        for(const chan in Guild.channels) {
            if(Guild.channels[chan]) {
                chanVote++
            }
        }
        Guild.voteCap = (q > 0) ? (q + 1 - chanVote): q;
        Global.Fn.monGuilDB({_id: this.msg.guild.id}, "update", Guild);
    }
}