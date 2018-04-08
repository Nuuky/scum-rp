'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')

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
        const targetUsername = this.msg.guild.members.get(target.id).displayName;
        const dispatcher = connection.playFile('C:/Users/Discord/Desktop/myfile.mp3');
        console.log(tVChan)
        
      
        dispatcher.on('end', () => {
          // The song has finished
        });

        dispatcher.on('error', e => {
          // Catch any errors that may arise
          console.log(e);
        });

        dispatcher.setVolume(0.5); // Set the volume to 50%
        dispatcher.setVolume(1); // Set the volume back to 100%

        console.log(dispatcher.time); // The time in milliseconds that the stream dispatcher has been playing for

        dispatcher.pause(); // Pause the stream
        dispatcher.resume(); // Carry on playing

        dispatcher.end(); // End the dispatcher, emits 'end' event
        
    }
}