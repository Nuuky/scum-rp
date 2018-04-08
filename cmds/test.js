'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')

module.exports = class TestCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot
        
        
        msg.reply("/tts This is for you")        
    }
}