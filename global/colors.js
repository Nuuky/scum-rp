'use strict'

const Config = require("../json/config.json");

module.exports = {
    send: (msg, text, sec = Config.bot.purgetime) => {
        msg.channel.send(text)
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    },
    reply: (msg, text, sec = Config.bot.purgetime) => {
      
        console.log("purge.js: " + text);
        msg.reply(text)
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    },
    embed: (msg, embed, sec = Config.bot.purgetime) => {
        msg.channel.send({embed})
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    },
    edit: (msg, text, sec = Config.bot.purgetime) => {
        msg.edit(text)
        .then(m => m.delete(1000 * sec))
        .catch(err => console.error(err));
    }
}; 