'use strict'

const Global = require('../global/')
const Json = require("../json/")
const express = require('express');
const app = express();
const assets = require('../assets')


app.use("/assets", assets);

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
        //const targetUsername = this.msg.guild.members.get(target.id).displayName;
        console.log('/assets/on_en_a_eu_un_autre.mp3')
        
        if(tVChan) {
          tVChan.join()
          .then(connection => {connection.playStream("/assets", assets);
              connection.playArbitraryInput('http://mysite.com/sound.mp3');
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