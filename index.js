'use strict'

const Discord = require("discord.js")
const bot = new Discord.Client({autorun: true})

const Json = require("./json/");
const Command = require("./cmds/");
const Global = require("./global/");
const http = require('http');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

require('events').EventEmitter.defaultMaxListeners = Infinity;


let prefix = Json.cfg.bot.prefix;



//let Guilds = {};

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db(process.env.DB_NAME);
//   var query = {};
//   dbo.collection("user_info").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     bot.tempUsers = {};
//     result.forEach(user => {
//         bot.tempGuilds[user._id] = user;
//     })
//     console.log(bot.tempGuilds)
//     db.close();
//   });
// });


// Ping bot every 5 minutes
app.get("/", (request, response) => {
  // console.log(Date.now() + " Ping Received");
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
            "name": "$cmd", //!help //GhostBot
            "type": "PLAYING", //PLAYING //STREAMING //LISTENING //WATCHING
            // "streaming": false,
            // "url": "" 
        }
    })
    .catch(console.error);
    // bot.user.setUsername("nk-bot");
});




bot.on("message", message => {
    // Watch if the message is for the bot + Permissions
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(message.channel.type != "dm") {
        if(!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")) return console.log("Can't send message in " + message.channel.name);
        if(message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) message.channel.fetchMessage(message.id)
            .then(m => setTimeout( () => {m.delete()}, 1000) ) 
            .catch(console.error);
    }
  
  
    // Test area ----------
    // if(message.author.id != process.env.MY_DISCORD_ID) return Global.Msg.reply(message, "Bot under maintenance.");

    // Parsing
    const msg = message.content;
    const exp = new RegExp("^\\"+ prefix +"(\\S+)\\s*(.*)");
    const query = msg.match(exp);
    if(query == null) return;


    const dispatcher = {
        'help': () => { return new Command.HelpCommand(bot, message) },
        'ping': () => { return new Command.PingCommand(bot, message) },
        'random': () => { return new Command.RandomCommand(bot, message) },
        'who': () => { return new Command.WhoCommand(bot, message) },
        'grp': () => { return new Command.GrpCommand(bot, message) },
        'rlg': () => { return new Command.RelCommand(bot, message) },
        'stats': () => { return new Command.StatsCommand(bot, message) },
        'ville': () => { return new Command.VilleCommand(bot, message) },
      
      
        // ADMIN ---------------------------
        //'prefix': () => { if(Global.Mch.admin(message, lang)) return new Command.PrefixCommand(bot, message) }, // ADMIN
      
      
        // FRIENDS -------------------------
      
      
        // ME ------------------------------
        'test': () => { if(Global.Mch.me(message)) return new Command.TestCommand(bot, message) },
        'slap': () => { if(Global.Mch.me(message)) return new Command.SlapCommand(bot, message) }
    };
  
  
    const command = dispatcher.hasOwnProperty(query[1]) ? dispatcher[query[1]]() : undefined

    if(command === undefined) {
    console.log('Command not found'); 
    return
    };
    command.run(query[2]);
        
    
});




bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
// bot.on("debug", (e) => console.info(e));




bot.login(process.env.TOKEN);