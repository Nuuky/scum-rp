'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

module.exports = class WhoCommand {

  constructor(bot, msg) {
    this.msg = msg;
    this.bot = bot;
    console.log("On y est !")
  }

  async run(query) {
    const args = query.split(" ");
    console.log("query: " + query)
    const msg = this.msg;
    //const Guild = this.bot.tempGuilds[msg.guild.id];
    //const prefix = Guild.prefix;
    let embed;

    if(query) {
      console.log("Il y a un critère");
        let searchObj;
        if(query.startsWith("<")) {
          searchObj = {_id: args[0]}
        } else {
          searchObj = {fullname: query}
        }
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            const dbo = db.db(process.env.DB_NAME);
                console.log("searchObj: " + searchObj["_id"])

            dbo.collection("scum_rp").findOne(searchObj, function(err, result) {
                if (err) throw err;
                console.log(result)

                // USERNAME -------
                let surname = "";
                result.surname.forEach(sur => { 
                    surname += " / " + sur; 
                });
                surname = surname.slice(3, -1);
        
                embed = {
                "embed": {
                    "embed": {
                      "title": "**" + result.name + " " + result.nick + "Nicoley Kavasky**",
                      "description": `**Surnom:** *${surname}*
                      **Age:** ${result.age}* ans*
                      **Groupe:** *${result.groupe}*
                      **Religion:** *${result.religion}*
                      0fa8mi44ll3e\n\n`,
                      "color": 10579647,
                      "thumbnail": {
                        "url": (result.url) ? result.url : "null"
                      },
                      "fields": [
                        {
                          "name": "Histoire",
                          "value": result.story,
                          "inline": true
                        }
                      ]
                    }
                  }
                }
                
                // FAMILLE -------
                dbo.collection("scum_rp").find({nick: result.nick}).toArray(function(err, result) {
                    if (err) throw err;

                    if(!result) {
                        embed.embed.description.replace("0fa8mi44ll3e", "");
                        return db.close();
                    }

                    let famille = "";
                    result.forEach(id => { 
                        famille += " / " + id.name + " " + id.nick;
                    });
                    famille = famille.slice(3, -1);

                    embed.embed.description.replace("0fa8mi44ll3e", "**Famille:** *" + famille + "*");
                  
                    Global.Msg.embed(msg, embed, 90);
                  
                    db.close();
                });

                db.close();
            });

        })


                
        return;
    }

    if(!args[0] && !args[1]) return console.log("No query") // Global.Msg.reply(msg, `\`${prefix}mapdata [heure] [temps]\``)


    // FAST TYPE
    switch(args[1]) {
      case "d":
        args[1] = "dégagé";
        break;
      case "tc":
        args[1] = "temps_couvert";
        break;
      case "p":
        args[1] = "pluie";
        break;
      case "t":
        args[1] = "tempête";
        break;
      case "b":
        args[1] = "brumeux";
        break;
      default:
        break;
    }

    let regex = Json.grw.weatherName
    let weathArg = args[1].toLowerCase();
    if(weathArg.match(regex) == null) return console.log("Wrong weather") // Global.Msg.reply(msg, "Le temps indiqué est incorrect.")
    weathArg = weathArg.match(regex)[0]

    let tempHours = args[0];
    tempHours.replace(" ", "")
    tempHours.replace(":", "")
    tempHours.replace(/[h|H]/, "")
    tempHours.replace(/0/g, "")
    if(isNaN(Number(tempHours))) return console.log("wrong hour (string)") // Global.Msg.reply(msg, "L'heure indiqué n'est pas bonne. Essayez l'un des formats suivant: `16 | 16h | 16h00 | 16:00`")
    regex = Json.grw.regHours
    if(tempHours.match(regex) == null && (Number(tempHours) > 23 || Number(tempHours) < 0)) {
      this.bot.fetchUser(process.env.MY_DISCORD_ID)
      .then(user => user.send(msg.author + " a voulu ajouter l'heure: `" + tempHours + "h` depuis la guild `" + msg.guild.name + "`"))
      
      return console.log("wrong hour (number)") // Global.Msg.reply(msg, "L'heure indiqué n'est pas bonne. Valeurs acceptés: `" + regex + "`")
    }
    tempHours = tempHours.match(regex)[0]

    const clWeather = weathArg[0].toUpperCase() + weathArg.slice(1, weathArg.length)
    console.log(`-------------> (${tempHours}h00 - ${clWeather}) added by ${Global.Fn.getNick(msg, msg.author.id)}`)

    const weathInc = {$inc: {}};
    weathInc.$inc["weather." + weathArg] = 1
    Global.Fn.monGuilDB({_id: "data_stats"}, "update", weathInc, "grw-data")
    
    const hourInc = {$inc: {}};
    hourInc.$inc["hours.h" + tempHours] = 1
    Global.Fn.monGuilDB({_id: "data_stats"}, "update", hourInc, "grw-data")

    Global.Msg.reply(msg, "Done.", 5)

  }
}