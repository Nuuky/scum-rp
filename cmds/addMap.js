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
        \n\`nomEng:\` Nom Anglais de la map (Remplacez les espaces par des "_").
        \n\`nomFr:\` Nom Français de la map (Remplacez les espaces par des "_").
        \n\`modeEng:\` \`${Json.grw.modesName}\` *(Utilisez exactement un de ces thermes)*
        \n\`urlImg:\` Url de l'image de la map, elle doit correspondre à l'exemple (taille etc...) -> https://zupimages.net/up/18/13/hsnr.jpg`, 30);
        if(args[4]) return Global.Msg.reply(msg, "Il y a trop d'informations, vérifiez que vous avez bien remplacé les espaces par des \"_\"")
        const regex = new RegExp(Json.grw.modesName);
        console.log(args[2])
        if(args[2].match(regex) == null) return Global.Msg.reply(msg, "Le mode indiqué n'existe pas, tappez " + prefix + "addmap pour en savoir plus ou créez en un nouveau avec " + prefix + "addmode");
        console.log(args[3])
        if(!args[3].startsWith("http")) return Global.Msg.reply(msg, "L'image doit être hebergé sur un site tierse, ex:  https://zupimages.net");
      
        let nameEn = args[0].replace("_", " ")
        let nameFr = args[1].replace("_", " ")

        const map = {
            "name": {
                "en": nameEn,
                "fr": nameFr
            },
            "mode":args[2], "url": args[3]
        }
        
        
        // Check if map already known
        let mapExist = false;
        
        const maps = Json.grw.maps;
        for(let i = 0; i < maps.length; i++) {
            for(let lang in maps[i].name) {
                console.log(`${args[0]} -- ${args[1]} -- ${maps[i].name[lang]}`)
                if(args[0] == maps[i].name[lang] || args[1] == maps[i].name[lang]) {
                    mapExist = true;
                    break
                }
            }
            if(mapExist) break
        }
        if(mapExist) return Global.Msg.reply(msg, "Cette map existe déjà.")

      
        // Get the index of the la map of the mode 
        let mapMode = false;
        let lastMapID;
        for(let i = 0; i < maps.length; i++) {
            console.log(maps[i].mode + " --- " + args[2])
            if(!mapMode && maps[i].mode["en"] == args[2]) {
                mapMode = true;
            }
            if(mapMode) {
                if(maps[i].mode != args[2]) return
                lastMapID = i + 1;
                break
            }
        }
        console.log("Can't find mode.");
        if(!mapMode) lastMapID = maps.length + 1

        Json.grw.maps.splice(lastMapID, 0, map);
        Global.Fn.upJSON("grw", Json.grw);

        Global.Msg.reply(msg, `${map.name[lang]} ajouté.`)
    }
}