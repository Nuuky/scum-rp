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
    let regex = Json.grw.weatherName
    let weathArg = args[1].toLowerCase();
    if(weathArg.match(regex) == null) return console.log("Wrong weather") // Global.Msg.reply(msg, "Le temps indiqué est incorrect.")


    let tempHours = args[0];
    tempHours.replace(" ", "")
    tempHours.replace(":", "")
    tempHours.replace(/[h|H]/, "")
    tempHours.replace(/0/g, "")
    if(isNaN(Number(tempHours))) return console.log("wrong hours (string)") // Global.Msg.reply(msg, "L'heure indiqué n'est pas bonne. Essayez l'un des formats suivant: `16 | 16h | 16h00 | 16:00`")
    regex = Json.grw.regHours
    if(tempHours.match(regex) == null) {
      console.log(this.bot.fetchUser(process.env.MY_DISCORD_ID))
      this.bot.fetchUser(process.env.MY_DISCORD_ID)
      .then(user => user.send(msg.author + " a voulu ajouter l'heure: `" + tempHours + "h` depuis la guild `" + msg.guild.name + "`"))
      
      return console.log("wrong hours (number)") // Global.Msg.reply(msg, "L'heure indiqué n'est pas bonne. Valeurs acceptés: `" + regex + "`")
    }


    const weathInc = {$inc: {}};
    weathInc.$inc["weather." + weathArg] = 1
    Global.Fn.monGuilDB({_id: "data_stats"}, "update", weathInc, "grw-data")
    // doc.$inc['activity.' + value]
    const hourInc = {$inc: {}};
    hourInc.$inc["hours.h" + tempHours] = 1
    Global.Fn.monGuilDB({_id: "data_stats"}, "update", hourInc, "grw-data")

    Global.Msg.reply(msg, "Done.", 5)

  }
}