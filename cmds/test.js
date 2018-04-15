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
        console.log("Test cmd. query = " + query);
        
        
        const test = "h16";
        Global.Fn.monGuilDB({id_: "hours"}, "update", {$inc: { test:1 }}, "grw-data")
        console.log({test:1 })
    }
}