'use strict'

const Global = require("../../global/");
const Json = require("../../json/");

module.exports = class VoteAction {

    static match (message, plObj, mapObj, actStr) {
        const Guild = Global.Fin.monGuilDB({_id: message.guild.id}, "find");
        const lang = Guild.lang;
        const prefix = Guild.prefix;

        const args = message.content.split(" ");
        // Not author turn
        if(message.author.id !== plObj.playerTurn().user.id) return Global.Msg.embed(message, {color: "16711849",title:"Erreur #playerID", description:"Ce n'est pas à votre tour de jouer."});
        // Wrong ban || pick
        if((args[0] == prefix + actStr) && ((actStr == "ban") ? (mapObj.ban == 0) :  (mapObj.ban > 0) )) return Global.Msg.embed(message, {color: "16711849", title:"Erreur #wrongCmd", description:`Mauvaise commande, il faut utiliser ${(actStr == "ban") ? prefix + "pick" : prefix + "ban"}`});
        // No map num
        if(mapObj.mapsArr[args[1]] == undefined) return Global.Msg.embed(message, {color: "16711849", title:"Erreur #wrongCmd", description:"Il faut le numéro de map."}, 5);
        // Map already pick/ban
        if(mapObj.mapsArr[args[1]].picked || mapObj.mapsArr[args[1]].banned) return Global.Msg.embed(message, {color: "16711849", title:"Erreur #wrongArg", description:"La map a déjà été traité."}, 5);
        return true
    }

    static run (omsg, message, plObj, mapObj, actStr, actVar) {
        const Guild = Global.Fin.monGuilDB({_id: message.guild.id}, "find");
        const lang = Guild.lang;
        const prefix = Guild.prefix;

        const args = message.content.split(" ");

        mapObj.mapsArr[args[1]].team = plObj.playerTurn().team;
        mapObj.mapsArr[args[1]][actVar] = true;
        mapObj[actStr]--

        let embed = Global.Ebd.vote(message, plObj, mapObj);
        omsg.edit({ embed })
        .catch(err => console.error(err));
        plObj.plBool = !plObj.plBool;
    }
}