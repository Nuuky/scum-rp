'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class HelpCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot
    }

    async run(query) {
        const Guild = this.bot.tempGuilds[this.msg.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;
        const args = query.split(" ");
        
        const CMDS = Json.langs[Guild.lang].cmds;
        let strMsg = "";
        CMDS.forEach((cmd) => {
            strMsg += `\`${Guild.prefix}${cmd[0]}\`: ${cmd[1]}\n\n`
        });

        const Msg = `
        **${Json.langs[Guild.lang].helpTitle} :**\n
${strMsg}
        `;
        Global.Msg.send(this.msg, Msg, 30)
    }
}