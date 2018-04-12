'use strict'

const Global = require('../global/')
const Json = require("../json/")

module.exports = class AddModeCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot
        const Guild = bot.tempGuilds[msg.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;
        const args = query.split(" ");
      
        if(!(args[0], args[1], args[2])) return Global.Msg.reply(msg, `**Ajouter un mode:** *(Il ne faut rien oublier)*
        \n\`${prefix}addmode [nomEng] [nomFr] [color]\`
        \n\`nomEng:\` Nom Anglais du mode.
        \n\`nomFr:\` Nom Français du mode.
        \n\`color:\` \`${Json.grw.modesColors}\` ou donnez la valeur décimale d'une couleur.`, 30);
        const regex = new RegExp(Json.grw.modesColors);
        if(args[2].match(regex) == null && isNaN(args[2])) return Global.Msg.reply("La couleur indiqué n'est pas bonne, tappez " + prefix + "addmode pour en savoir plus.");
      
      
        // Check if mode already known
        let modeExist;
        const modes = Json.grw.modes;
        modes.forEach(mode => {
            mode.name.forEach(lang => {
                if(args[0] == lang || args[1] == lang) {
                    return modeExist = true;
                }
            })
        });
        if(modeExist) return Global.Msg.reply(msg, "Ce mode existe déjà.")


        let color;
        if(isNaN(args[2])) {
            if(Global.strTo.color(args[2]) == "") return Global.Msg.reply(msg, "La couleur indiqué n'existe pas ou est déjà utilisé.")
            color = Global.strTo.color(args[2]);
            Json.grw.modesColors.replace(`${args[2]}|`, "")
            Json.grw.modesColors.replace(`|${args[2]}`, "")
        }

        let colorExist = false;
        if(!isNaN(args[2])) {
            if(args[2] < 0 || args[2] > 16777215) return Global.Msg.reply(msg, "Couleur décimale incorrecte.")
            Json.grw.modesDecimalColors.forEach(color => {
                if(args[2] == color) return colorExist = true;
            })
            if(!colorExist) {
                color = args[2]
                Json.grw.modesDecimalColors.push(args[2])
            };
        }
        if(colorExist) return Global.Msg.reply(msg, "La couleur est déjà utilisé.")
        


        const mode = {
            "name": {
                "en": args[0],
                "fr": args[1]
            },
            "color": color
        }

        Json.grw.modes.push(mode);
        Global.Fn.upJSON("grw", Json.grw);

        Global.Msg.reply(msg, `${mode.name[lang]} ajouté.`)
    }
}