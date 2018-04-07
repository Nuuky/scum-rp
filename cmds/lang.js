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
    const trans = Json.langs[lang]
    //console.log(query);
    
    
    const regexLang = Json.langs.regex;
    if(!query[0]) {
       let embed = {
            title: regexLang,
            description: Json.langs.langList
        }
        Message.send(msg, embed);
    }
    if(query[0].match(regexLang)){
        this.bot.tempGuilds[msg.guild.id].lang = query[0];
        lang = Json.langs[query[0]];
        Fn.monGuilDB({_id: msg.guild.id}, "update", {$set: {lang: query[0]}});
        Message.send(msg, `Langue changé: ${query[0]}\``);
    }

  }
}


// prefix = msgCall[1];
// message.channel.send("The prefix have been changed, it's now: ``" + prefix + "``")