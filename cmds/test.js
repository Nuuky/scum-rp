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
        

        let regex = Json.grw.weatherName
        let weathArg = query.toLowerCase();
        let checkRegex = weathArg.match(regex)
        console.log(checkRegex[0])
        console.log(checkRegex[1] + " -- " + checkRegex[2] + " //// " + (checkRegex[1] = checkRegex[2]))
        query;
    }
}