'use strict'

const Global = require("../../global/");
const Json = require("../../json/");

module.exports = class VoteAction {

    static match (bot, message, plObj, mapObj, actStr) {
        const Guild = bot.tempGuilds[message.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;
        const orange = Global.strTo.color("orange");

        const args = message.content.split(" ");
        // Not author turn
        if(message.author.id !== plObj.playerTurn().user.id) return Global.Msg.embed(message, {"color": orange, "title":`${Json.langs[lang].err} #playerID`, "description": Json.langs[lang].vote.shld.wrongTurn});
        // Wrong ban || pick
        if((args[0] == prefix + actStr) && ((actStr == "ban") ? (mapObj.ban == 0) :  (mapObj.ban > 0) )) return Global.Msg.embed(message, {"color": orange, "title":`${Json.langs[lang].err} #wrongCmd`, "description": `${Json.langs[lang].vote.shld.wrongCmd} ${(actStr == "ban") ? prefix + "pick" : prefix + "ban"}`});
        // No map num
        if(mapObj.mapsArr[args[1]] == undefined) return Global.Msg.embed(message, {"color": orange, "title":`${Json.langs[lang].err} #wrongCmd`, "description": Json.langs[lang].vote.shld.noMapNum}, 5);
        // Map already pick/ban
        if(mapObj.mapsArr[args[1]].picked || mapObj.mapsArr[args[1]].banned) return Global.Msg.embed(message, {"color": orange, "title":`${Json.langs[lang].err} #wrongArg`, "description": Json.langs[lang].vote.shld.mapTook}, 5);
        return true
    }

    static run (bot, omsg, message, plObj, mapObj, actStr, actVar) {
        const Guild = bot.tempGuilds[message.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;

        const args = message.content.split(" ");

        mapObj.mapsArr[args[1]].team = plObj.playerTurn().team;
        mapObj.mapsArr[args[1]][actVar] = true;
        mapObj[actStr]--

        let embed = Global.Ebd.vote(message, plObj, mapObj, lang, prefix);
        omsg.edit({ embed })
        .catch(err => console.error(err));
        plObj.plBool = !plObj.plBool;
    }
}