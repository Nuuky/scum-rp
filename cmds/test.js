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
        
        
        const test = 16;
        Global.Fn.monGuilDB({id_: "hours"}, "update", "{$inc: {h" + test + ": 1}}")
        query;
    }
}