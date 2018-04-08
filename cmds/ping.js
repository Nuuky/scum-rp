'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class PingCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot
    }

    async run(query) {
        const Guild = this.bot.tempGuilds[this.msg.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;
        const args = query.split(" ");
        
        this.msg.channel.send("Checking...")
        .then((m) => {
            const embed = {
                color: 52224,
                description: `:stopwatch:️ ${m.createdTimestamp - this.msg.createdTimestamp}ms 
            \n:heartbeat: ${Math.round(this.bot.ping)}ms`
            }
            Global.Msg.edit(m, {embed: embed});
        })
    }
}









