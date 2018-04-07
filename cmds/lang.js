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
    const lang = Guild.lang;
    const msg = this.msg;
    //console.log(query);
    
    
    if(!args[1]) {
        msg.channel.send({
            embed: {
                title: `Langages disponibles:`,
                description: `fr / en`
            }
        })
        .then(m => {
            setTimeout(() => {
                m.delete();
            }, 10000)
        });
        msg.delete();
    }
    if(args[1] == "en" || args[1] == "fr"){
        lang = args[1].toString();
        msg.delete();
    }

  }
}


// prefix = msgCall[1];
// message.channel.send("The prefix have been changed, it's now: ``" + prefix + "``")