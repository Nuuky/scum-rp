'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class RandomCommand {

    constructor(msg, lang, prefix) {
        this.msg = msg;
    }

    async run(query) {
        const lang = Json.guilds[this.msg.guild.id].lang;
        const prefix = Json.guilds[this.msg.guild.id].prefix;
        const args = query.split(" ");

        const randomWeather = Json.grw.weather[Global.Fn.randomNumber(0, Json.grw.weather.length - 1)],
        randomMaps = Json.grw.maps[Global.Fn.randomNumber(0, Json.grw.maps.length - 1)],
        embed = {
            "title": (args[0] && args[1]) ? `[${args[0].toString()}] vs [${args[1].toString()}]` : '',
            "description": `**${randomMaps.name[this.lang].toUpperCase()}**
            \n🕑 ${Global.Fn.randomNumber(0, 24)}h               ${randomWeather.emoji} ${randomWeather.name[this.lang]}`,
            "color": Global.Fn.getMode(randomMaps.mode).color,
            "thumbnail": {
                "url": randomMaps.url
            }
        };
        Global.Msg.embed(this.msg, embed, 60);
    }
}