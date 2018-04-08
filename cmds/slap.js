'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')

module.exports = class SerVoteCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot
        const target = msg.mentions.users.first() || null;
        const args = query.split(" ");
        const text = args[0].replace(".", " ");
        if(target == null) return;
      
        const tVChan = this.msg.guild.members.get(target.id).voiceChannel;
        console.log(tVChan)
        
        if(tVChan) {
            
            say.speak(text, args[1] || "Cellos", args[2]  || 1.0, (err) => {
                if (err) {
                    return console.error(err);
                }
            });
        }             
        
    }
}