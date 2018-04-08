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
            let color;
            if(Math.round(this.bot.ping) < 30) color = Global.strTo.color("green");
            if(Math.round(this.bot.ping) > 50) color = Global.strTo.color("orange");
            if(Math.round(this.bot.ping) > 100) color = Global.strTo.color("red");
            const embed = {
                color: color,
                description: `:stopwatch:️ ${m.createdTimestamp - this.msg.createdTimestamp}ms 
            \n:heartbeat: ${Math.round(this.bot.ping)}ms`
            }
            Global.Msg.edit(m, {embed: embed});
        })
    }
}









