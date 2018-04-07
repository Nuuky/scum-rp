'use strict'

const Message = require('../global/purge');
const Fn = require("../global/functions");

module.exports = class PrefixCommand {

  constructor(bot, msg) {
    this.guild = bot.tempGuilds[msg.guild.id];
    this.msg = msg;
  }

  async run(query) {
    const Guild = this.guild;
    const args = query.split(" ");
    const prefix = args[0]
    //console.log(query);
    
    
    let embed = {};
    if (!query) {
        return Message.send(this.msg, `Pour lancer une commande tappez ${Guild.prefix}cmd`);
    }

    if(args[1]) {
      return Message.send(this.msg, "Commande incorrect.");
    }
    
    Fn.monGuilDB({_id: this.msg.guild.id}, "update", {$set: {prefix: prefix}});
        Global.Fn.monGuilDB({_id: this.msg.guild.id}, "update", {$set: {voteCap: this.bot.tempGuilds[this.msg.guild.id].voteRef}});
      
    Message.send(this.msg, `Le prefix a été changé: \`\`${prefix}\`\``);

  }
}


// prefix = msgCall[1];
// message.channel.send("The prefix have been changed, it's now: ``" + prefix + "``")