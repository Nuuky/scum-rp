'use strict'

const Discord = require("discord.js")
const bot = new Discord.Client({autorun: true})

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
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})

// setInterval(() => { 
//   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000); 


bot.on("ready", () => {
    //bot.user.setAvatar("../nk-bot/img/avatar.jpg").catch(console.error)
    bot.user.setPresence({
        status: "online", //dnd //online //invisible //idle
        game: {
            "name": "!help", //!help //GhostBot
            "type": "PLAYING", //PLAYING //STREAMING //LISTENING //WATCHING
            // "streaming": false,
            // "url": "" 
        }
    })
    .catch(console.error);
    // bot.user.setUsername("nk-bot");
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
});

bot.on("guildDelete", (guild) => {
    console.log("Guild deleted");
    delete bot.tempGuilds[guild.id];
    Global.Fn.monGuilDB({_id: guild.id}, "remove");
});




bot.on("message", message => {
    // Watch if the message is for the bot
    if(message.author.bot) return;


    // Guilds settings
    const Guild = bot.tempGuilds[message.guild.id];
    const prefix = Guild.prefix;
    const lang = Guild.lang;
    if(!message.content.startsWith(prefix)) return;
    if(!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")) return console.log("Can't send message in " + message.channel.name);



    if(message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) message.channel.fetchMessage(message.id)
        .then(m => setTimeout( () => {m.delete()}, 500) ) 
        .catch(console.error);
  
  
    // Test area ----------
    // if(message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) message.channel.fetchMessage(message.id).then(m => m.delete()).catch(console.error);
    // return Global.Msg.reply(message, "Bot under maintenance.");

    // Parsing
    const msg = message.content;
    const exp = new RegExp("^\\"+ prefix +"(\\S+)\\s*(.*)");
    const query = msg.match(exp);
    if(query == null) return;


    const dispatcher = {
        'help': () => { return new Command.HelpCommand(bot, message) },
        'ping': () => { return new Command.PingCommand(bot, message) },
        'random': () => { return new Command.RandomCommand(bot, message) },
        'vote'  : () => { if(Global.Mch.vote(bot, message)) return new Command.VoteCommand(bot, message) },
        'addmap'  : () => { if(Global.Mch.friends(message)) return new Command.AddMapCommand(bot, message) }, // FRIENDS
        'addmode'  : () => { if(Global.Mch.friends(message)) return new Command.AddModeCommand(bot, message) }, // FRIENDS
        'removemap'  : () => { if(Global.Mch.friends(message)) return new Command.RemoveMapCommand(message) }, // FRIENDS
        'prefix': () => { if(Global.Mch.admin(message, lang)) return new Command.PrefixCommand(bot, message) }, // ADMIN
        'lang': () => { if(Global.Mch.admin(message, lang)) return new Command.LangCommand(bot, message) }, // ADMIN
        'test': () => { if(Global.Mch.me(message)) return new Command.TestCommand(bot, message) }, // ME
        'slap': () => { if(Global.Mch.me(message)) return new Command.SlapCommand(bot, message) }, // ME
        'hi': () => { if(Global.Mch.me(message)) return new Command.HiCommand(bot, message) }, // ME
        'servervote'  : () => { if(Global.Mch.me(message)) return new Command.SerVoteCommand(bot, message) }, // ME
    };
    const command = dispatcher.hasOwnProperty(query[1]) ? dispatcher[query[1]]() : undefined;

    if(Guild.channels[message.channel.id] && Guild.channels[message.channel.id].voteMax) return; // Prevent spaming msg in a voting chan

    if(command === undefined) {
    console.log('Command not found'); 
    return
    };
    command.run(query[2]);
        
    
});




bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
//bot.on("debug", (e) => console.info(e));




bot.login(process.env.TOKEN) 