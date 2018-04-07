'use strict'

const Message = require('../global/purge');
const Fn = require("../global/functions");

module.exports = class PrefixCommand {

  constructor(msg) {
    this.msg = msg;
  }

  async run(query) {
    const Guild = Fn.monGuilDB({_id:this.msg.guild.id}, "find")
    const args = query.split(" ");
    //console.log(query);
    console.log(args[0]);
    
    
    let embed = {};
    if (!query) {
        return Message.send(this.msg, `Pour lancer une commande tappez ${guild.prefix}cmd`);
    }

    if(args[1]) {
      return Message.send(this.msg, "Commande incorrect.");
    }
    
    Fn.monGuilDB({_id: this.msg.guild.id}, "update", {$set: {prefix: args[0]}});
      
    Message.send(this.msg, `Le prefix a été changé: \`\`${args[0]}\`\``);

  }
}


// prefix = msgCall[1];
// message.channel.send("The prefix have been changed, it's now: ``" + prefix + "``")