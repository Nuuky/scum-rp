'use strict'

const Global = require('../global/')
const Json = require("../json/")

module.exports = class SlapCommand {

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
        if(!tVChan.permissionsFor(this.bot.user).has("CONNECT")) return
        
        if(tVChan) {
          tVChan.join()
          .then(connection => {
              let dispatcher = connection.playArbitraryInput('https://cdn.glitch.com/f7bc4439-ba46-4b35-9030-a6e245debc02%2Fon_en_a_eu_un_autre.mp3?1523198968126');
              dispatcher.on('end', () => {
                  dispatcher = connection.playArbitraryInput('https://cdn.glitch.com/f7bc4439-ba46-4b35-9030-a6e245debc02%2Faie.mp3?1523198990972');
                  dispatcher.setVolume(0.5);
                  dispatcher.on('end', () => {
                      dispatcher = connection.playArbitraryInput('https://cdn.glitch.com/f7bc4439-ba46-4b35-9030-a6e245debc02%2Fil_y_a_quelque_chose_d\'autre.mp3?1523201758061');
                      dispatcher.setVolume(1);
                      dispatcher.on('end', () => {
                          setTimeout(() => {
                            tVChan.leave();
                          }, 2000)
                      });
                  });
              });
          })
        }
      
//         dispatcher.on('end', () => {
//           // The song has finished
//         });

//         dispatcher.setVolume(0.5); // Set the volume to 50%
//         dispatcher.setVolume(1); // Set the volume back to 100%

//         console.log(dispatcher.time); // The time in milliseconds that the stream dispatcher has been playing for

//         dispatcher.pause(); // Pause the stream
//         dispatcher.resume(); // Carry on playing

//         dispatcher.end(); // End the dispatcher, emits 'end' event
        
    }
}