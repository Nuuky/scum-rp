'use strict'

const Discord = require("discord.js")
const bot = new Discord.Client({autorun: true})

const fs = require("fs")
const Json = require("./json/")
const Command = require("./cmds/")
const Global = require("./global/")

require('events').EventEmitter.defaultMaxListeners = Infinity;


/** This is a description of the foo function. */

// Reseting guilds &=> channels vote info
for(let guild in Json.guilds) {
    Json.guilds[guild].vote = {};
    Json.guilds[guild].vote.max = false;
    Json.guilds[guild].vote.cap = Json.guilds[guild].vote.ref;
    const teamChans = {}
    for(let chan in Json.guilds[guild].channels) {
        teamChans[chan] = {};
        teamChans[chan].vote = false;
    }
    Json.guilds[guild].channels = teamChans;
}
Global.Fn.upJSON("guilds", Json.guilds);


// Ping bot every 5 minutes
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);




bot.on("ready", () => {
    // bot.user.setAvatar("./img/boty.jpg").catch(console.error)  // Use it Once !
    bot.user.setPresence({
        game: {
            "name": "",//"$help",
            "streaming": false,
            "type": 0,
            "url": ""
        }
    })
    .catch(console.error);
});

bot.on("guildCreate", (guild) => {
    Json.guilds[guild.id] = {
        "prefix": "!",
        "lang": "fr",
        "botInfo": {
            "ID": null,
            "msgID": null
        },
        "vote": {
            "ref": 2,
            "max": false,
            "cap": 2
        },
        "channels": {}
    }
    Global.Fn.upJSON("guilds", Json.guilds);
})




bot.on("message", message => {
    // Watch if the message is for the bot
    if(message.author.bot) return;


    // Test area ----------

    
    // message.channel.fetchMessage(message.id)
    // .then(m => {console.log(m); m.delete(); })
    // .catch(console.error)


    // Guilds settings
    const Guild = Json.guilds[message.guild.id];
    const prefix = Guild.prefix;
    const lang = Guild.lang;
    if(!message.content.startsWith(prefix)) return;


    // Parsing
    const msg = message.content;
    const exp = new RegExp("^\\"+ prefix +"(\\S+)\\s*(.*)");
    const query = msg.match(exp);
    if(query == null) return;


    const dispatcher = {
        'prefix': () => { return new Command.PrefixCommand(message) },
        'random': () => { return new Command.RandomCommand(message) },
        'vote'  : () => { if(Global.Mch.vote(message)) return new Command.VoteCommand(message) },
        'servervote'  : () => { if(Global.Mch.servote(message)) return new Command.SerVoteCommand(message) },
    };
    const command = dispatcher.hasOwnProperty(query[1]) ? dispatcher[query[1]]() : undefined;

    if(Guild.channels[message.channel.id] && Guild.channels[message.channel.id].vote) return; // Prevent spaming msg in a voting chan

    if(command === undefined) {
    console.log('Command not found');
    return
    };
    command.run(query[2]);



    message.channel.fetchMessage(message.id)
    .then(m => m.delete())
    .catch(console.error)
});




bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));




bot.login(process.env.TOKEN)