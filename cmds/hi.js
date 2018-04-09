'use strict'

const Global = require('../global/')
const Json = require("../json/")

module.exports = class HiCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot
        const target = msg.mentions.users.first() || null;
        const args = query.split(" ");
        if(target == null) return;
        const tVChan = this.msg.guild.members.get(target.id).voiceChannel;
        if(!tVChan.permissionsFor(this.bot.user).has("CONNECT")) return
        
        if(tVChan) {
          tVChan.join()
          .then(connection => {
              let dispatcher = connection.playArbitraryInput('https://cdn.glitch.com/f7bc4439-ba46-4b35-9030-a6e245debc02%2Fsalut_2.mp3?1523298425345');
              dispatcher.on('end', () => {
                setTimeout(() => {
                  tVChan.leave();
                }, 2000)
              });
          })
        }
        
    }
}