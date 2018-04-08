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
        console.log(tVChan)
        
        if(tVChan) {
            tVChan.join();
            say.speak("this is for you !");
        }             
        
    }
}