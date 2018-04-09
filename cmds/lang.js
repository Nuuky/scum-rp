'use strict'

const Json = require('../json/');
const Message = require('../global/purge');
const Fn = require("../global/functions");

module.exports = class PrefixCommand {

  constructor(bot, msg) {
    this.guild = bot.tempGuilds[msg.guild.id];
    this.msg = msg;
    this.bot = bot;
  }

  async run(query) {
    const Guild = this.guild;
    const args = query.split(" ");
    const prefix = Guild.prefix;
    const lang = Guild.lang;
    const msg = this.msg;
    let trans = Json.langs[lang]
    
    
    const regexLang = Json.langs.regex;
    if(!args[0]) {
        return Message.send(msg, `${trans.langList}\`${regexLang}\``);
    }
    if(args[0].match(regexLang) != null) {
        this.bot.tempGuilds[msg.guild.id].lang = args[0];
        trans = Json.langs[args[0]];
        Fn.monGuilDB({_id: msg.guild.id}, "update", {$set: {lang: args[0]}});
        return Message.send(msg, `${trans.langUpdated} \`${trans.name}\``);
    }
    
    Message.reply(msg, trans.langUnkn); // Json.langs.langUnkn

  }
}


// prefix = msgCall[1];
// message.channel.send("The prefix have been changed, it's now: ``" + prefix + "``")