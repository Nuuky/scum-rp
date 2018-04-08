'use strict'

const Discord = require("discord.js")
const bot = new Discord.Client({autorun: true})

const fs = require("fs")
const Json = require("./json/")
const Command = require("./cmds/")
const Global = require("./global/")
const http = require('http');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

require('events').EventEmitter.defaultMaxListeners = Infinity;





let Guilds = {};

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("rob-bot");
  var query = {};
  dbo.collection("guilds").find({}).toArray(function(err, result) {
    if (err) throw err;
    bot.tempGuilds = {};
    result.forEach(guild => {
        bot.tempGuilds[guild._id] = guild;
    })
    //console.log(bot.tempGuilds)
    db.close();
  });
});


// Ping bot every 5 minutes
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
        status: "online", //dnd //online //invisible //idle
        game: {
            "name": "", //!help //GhostBot
            //"type": "PLAYING" //PLAYING //STREAMING //LISTENING //WATCHING
            "streaming": false,
            "url": "" 
        }
    })
    .catch(console.error);
});

bot.on("guildCreate", (guild) => {
    //Global.Fn.monGuilDB(newGuild, "create")
    const newGuild = {
        "_id": guild.id,
        "prefix": "!",
        "lang": "fr",
        "botInfo": {
            "ID": null,
            "msgID": null
        },
        "voteRef": 2,
        "voteCap": 2,
        "voteMax": false,
        "channels": {}
    }
    bot.tempGuilds[guild.id] = newGuild;
  
    Global.Fn.monGuilDB(newGuild, "create");
})




bot.on("message", message => {
    // Watch if the message is for the bot
    if(message.author.bot) return;


    // Test area ----------
    // if(message.content.startsWith("!") || message.content.startsWith("$")) return Global.Msg.reply(message, "Le bot est actuellement en maintenance.");
    
    // message.channel.fetchMessage(message.id)
    // .then(m => {console.log(m); m.delete(); })
    // .catch(console.error)


    // Guilds settings
    const Guild = bot.tempGuilds[message.guild.id];
    const prefix = Guild.prefix;
    const lang = Guild.lang;
    if(!message.content.startsWith(prefix)) return;


    // Parsing
    const msg = message.content;
    const exp = new RegExp("^\\"+ prefix +"(\\S+)\\s*(.*)");
    const query = msg.match(exp);
    if(query == null) return;


    const dispatcher = {
        'help': () => { return new Command.HelpCommand(bot, message) },
        'ping': () => { return new Command.PingCommand(bot, message) },
        'prefix': () => { return new Command.PrefixCommand(bot, message) },
        'lang': () => { return new Command.LangCommand(bot, message) },
        'test': () => { return new Command.TestCommand(bot, message) },
        'slap': () => { return new Command.SlapCommand(bot, message) },
        'random': () => { return new Command.RandomCommand(bot, message) },
        'vote'  : () => { if(Global.Mch.vote(bot, message)) return new Command.VoteCommand(bot, message) },
        'servervote'  : () => { if(Global.Mch.me(message)) return new Command.SerVoteCommand(bot, message) },
    };
    const command = dispatcher.hasOwnProperty(query[1]) ? dispatcher[query[1]]() : undefined;

    if(Guild.channels[message.channel.id] && Guild.channels[message.channel.id].voteMax) return; // Prevent spaming msg in a voting chan

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
//bot.on("debug", (e) => console.info(e));




bot.login(process.env.TOKEN) 