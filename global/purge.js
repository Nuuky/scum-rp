'use strict'

const Config = require("../json/config.json");

module.exports = {
    send: (msg, text, sec = Config.bot.purgetime) => {
        if(!msg.channel.permissionsFor(this.bot.user).has("SEND_MESSAGES")) return console.log("Can't send message in " + msg.channel.name);
        msg.channel.send(text)
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    },
    reply: (msg, text, sec = Config.bot.purgetime) => {
        if(!msg.channel.permissionsFor(this.bot.user).has("SEND_MESSAGES")) return console.log("Can't reply message in " + msg.channel.name);
        msg.reply(text)
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    },
    embed: (msg, embed, sec = Config.bot.purgetime) => {
        if(!msg.channel.permissionsFor(this.bot.user).has("SEND_MESSAGES")) return console.log("Can't embed message in " + msg.channel.name);
        msg.channel.send({embed})
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    },
    edit: (msg, text, sec = Config.bot.purgetime) => {
        if(!msg.channel.permissionsFor(this.bot.user).has("SEND_MESSAGES")) return console.log("Can't edit message in " + msg.channel.name);
        msg.edit(text)
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    }
}; 