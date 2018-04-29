'use strict'

const Json = require('../json/');
const Global = require("../global/");

module.exports = class MapDataCommand {

  constructor(bot, msg) {
    this.msg = msg;
    this.bot = bot;
  }

  async run(query) {
    const args = query.split(" ");
    const msg = this.msg;
    const Guild = this.bot.tempGuilds[msg.guild.id];
    const prefix = Guild.prefix;
    const lang = Guild.lang;
    const trans = Json.langs[lang]


    if(!args[0] && !args[1]) return console.log("No query") // Global.Msg.reply(msg, `\`${prefix}mapdata [heure] [temps]\``)

    if(args[0] == "stats") {
      return Global.Fn.mapDataStats(msg)
    }

    if(args[2]) return console.log("Wrong msg format") // Global.Msg.reply(msg, "Le format de votre message n'est pas le bon.")

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