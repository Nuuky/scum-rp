'use strict'

// const Fn = require("./functions");
const Json = require("../json/");
const Message = require("./purge");
const Fn = require("./functions");
const fs = require("fs")

module.exports = {

    vote: (msg) => {
        const Guild = Json.guilds[msg.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;
        const trans = Json.langs[lang];
        const args = msg.content.split(" ");


        // Check if channel known
        if(!Guild.channels[msg.channel.id]) {
            Guild.channels[msg.channel.id] = {}
            Guild.channels[msg.channel.id].vote = false;
            Json.guilds[msg.guild.id] = Guild;
            Fn.upJSON("guilds", Json.guilds)
        }

        if(Json.guilds[msg.guild.id].voteMax) return Message.reply(msg, trans.vote.shld.voteMax); // Max vote reached
        if(Json.guilds[msg.guild.id].channels[msg.channel.id].vote) {msg.delete(); return Message.send(msg, trans.vote.shld.voteIn, 5)} // Already a vote in the chan
        if(!msg.channel.name.startsWith(Json.voteSet.channelName)) return Message.reply(msg, trans.vote.shld.wrgChan); // Check for channel name
        if(!args[1] || !args[2]) return Message.reply(msg, "**" + trans.vote.shld.noArgs[0] + "**\n``` " + prefix + trans.vote.shld.noArgs[1] + "```"); // Missing args
        if(!args[1].startsWith("<@")) return Message.reply(msg, trans.vote.shld.mention); // Opponent not @mentioned
        let bestOfRegExp = args[2].match(/[Bb][Oo][135]||[135]||auto/);
        if(bestOfRegExp == null) return Message.reply(msg, trans.vote.shld.numbMaps); // args[1] not valide
        return true
    },
    servote: (msg) =>{
        if(msg.author.id != "98095710548795392") return
        return true
    }
}
        
        
        