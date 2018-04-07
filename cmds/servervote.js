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
        const guildChans = Guild.channels.map(c => c.id)
        guildChans.forEach(chan => {
            if(Guild.channels[chan].vote) {
              chanVote++
            }
        })
        const voteRef = bot.tempGuilds[msg.guild.id].voteRef
        bot.tempGuilds[msg.guild.id].voteCap = (q > 0) ? (q + 1 - chanVote): q;
        Global.Fn.monGuilDB({_id: msg.guild.id}, "update", {$set: {voteRef: voteRef, voteCap: voteRef}});
    }
}