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
        
        if(target && target)
        
    }
}