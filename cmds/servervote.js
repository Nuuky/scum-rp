'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class SerVoteCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot

        const q = Number(query)
        const Guild = bot.tempGuilds[msg.guild.id];
        bot.tempGuilds[msg.guild.id].voteRef = (q > 0) ? q + 1 : q;
        let chanVote = 0;
        for(const chan in Guild.channels) {
            if(Guild.channels[chan]) {
                chanVote++
            }
        }
        const voteCap = bot.tempGuilds[msg.guild.id].voteRef
        bot.tempGuilds[msg.guild.id].voteCap = (q > 0) ? (q + 1 - chanVote): q;
        Global.Fn.monGuilDB({_id: msg.guild.id}, "update", {$set: {voteCap: voteCap}});
    }
}