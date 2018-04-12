'use strict'

const Global = require('../global/')
const Json = require("../json/")

module.exports = class AddMapCommand {

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
      
        if(!(args[0], args[1], args[2], args[3])) return Global.Msg.reply(msg, `**Ajouter une map:** *(Il ne faut rien oublier)*
        \n\`${prefix}addmap [nomEng] [nomFr] [modeEng] [urlImg]\`
        \n\`nomEng:\` Nom Anglais de la map.
        \n\`nomFr:\` Nom Français de la map.
        \n\`modeEng:\` ${Json.grw.modesName} *(Utilisez exactement un de ces thermes)*
        \n\`urlImg:\` Url de l'image de la map, elle doit correspondre à l'exemple (taille etc...) -> https://zupimages.net/up/18/13/hsnr.jpg`);
        const regex = new RegExp(Json.grw.modesName);
        if(args[2].match(regex) == null) return Global.Msg.reply("Le mode indiqué n'est pas le bon, tappez " + prefix + "addmap pour en savoir plus.");
        if(!args[3].startWith("http")) return Global.Msg.reply("L'image doit être hebergé sur un site tierse, ex:  https://zupimages.net");

        const map = {
            "name": {
                "en": args[0],
                "fr": args[1]
            },
            "mode":args[2], "url": args[3]
        }
        
        
        // Check if mode already known
        let mapExist = false;
        Json.grw.maps.forEach(map => {
            map.name.forEach(lang => {
                if(args[0] == lang || args[1] == lang) {
                    return mapExist = true;
                }
            })
        });
        if(mapExist) return Global.Msg.reply(msg, "Cette map existe déjà.")

      
        // Get the index of the la map of the mode 
        let mapMode = false;
        let lastMapID;
        Json.grw.maps.forEach((map, index) => {
            if(!mapMode && map.mode["en"] == args[2]) {
                mapMode = true;
            }
            if(mapMode) {
                if(map.mode["en"] != args[2]) return
                lastMapID = index + 1;
            }
        });
        if(!mapMode) return console.log("Can't find mode.");

        Json.grw.maps.splice(lastMapID, 0, map);
        Global.Fn.upJSON("grw", Json.grw);

        Global.Msg.reply(msg, `${map.name[lang]} retiré.`)
    }
}