'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class SerVoteCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const q = Number(query)
        const Guild = this.bot.tempGuilds[this.msg.guild.id];
        this.bot.tempGuilds[this.msg.guild.id].voteRef = (q > 0) ? q + 1 : q;
        let chanVote = 0;
        for(const chan in Guild.channels) {
            if(Guild.channels[chan]) {
                chanVote++
            }
        }
        this.bot.tempGuilds[this.msg.guild.id].voteCap = (q > 0) ? (q + 1 - chanVote): q;
        Global.Fn.monGuilDB({_id: this.msg.guild.id}, "update", {$set: {voteCap: this.bot.tempGuilds[this.msg.guild.id].voteRef}});
    }
}