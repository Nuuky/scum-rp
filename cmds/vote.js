'use strict'

const Json = require("../json/");
const Global = require("../global/");
const VoteAction = require("./vote/vote-action");
const Discord = require("discord.js")




module.exports = class VoteCommand {
    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;

        const Guild = bot.tempGuilds[msg.guild.id];
        const lang = Guild.lang;
        const prefix = Guild.prefix;
        const args = msg.content.split(" ");

        // ---------------------------------------------------------------------
        // ------------------------- PLAYERS SETTINGS --------------------------
        // ---------------------------------------------------------------------
        let team1, team2;
        this.plObj = {}
        // Player 1
        this.plObj.teams = false;
        this.plObj.pl1 = {};
        this.plObj.pl1.user = msg.author;
        this.plObj.pl1.team = Global.Fn.getNick(msg, this.plObj.pl1.user.id);
        // Player 2
        this.plObj.pl2 = {};
        this.plObj.pl2.user = msg.mentions.users.first();
        this.plObj.pl2.team = Global.Fn.getNick(msg, this.plObj.pl2.user.id);
        // Teams Name
        if(args[3] && args[4]){ // If author give teams name
            this.plObj.pl1.team = args[3].toString();
            this.plObj.pl2.team = args[4].toString();
            this.plObj.teams = true;
        }
        // Who's next ?
        this.plObj.plBool = true;
        this.plObj.playerTurn = () => {
            return (this.plObj.plBool) ? this.plObj.pl1 : this.plObj.pl2;
        };


        // ---------------------------------------------------------------------
        // --------------------------- MAPS SETTINGS ---------------------------
        // ---------------------------------------------------------------------
        const maps = Json.grw.maps;
        this.mapObj = {};
        this.mapObj.mapsArr = [];
        maps.forEach((map, id) => {
            this.mapObj.mapsArr.push({
                "id": id,
                "team": "None",
                "banned": false,
                "picked": false
            });
        });
        this.mapObj.manualDisplay = true;
        if(this.plObj.teams && args[5]) {
            this.mapObj.manualDisplay = (args[5].match(/auto/)) ? false :  true;
        } 
        if(!this.plObj.teams && args[3]) {
            this.mapObj.manualDisplay = (args[3].match(/auto/)) ? false :  true;
        }
        const bestOfRegExp = (args[2].match(/[Bb][Oo][135]/)) ? Number(args[2].replace(/[Bb][Oo]/, "")) :  Number(args[2]);
        this.mapObj.mapNumb = bestOfRegExp;
        // How many map to pick
        this.mapObj.pick = (this.mapObj.mapNumb == 1) ? 2 : this.mapObj.mapNumb - 1;
        // How many map to ban
        let isPair = ((maps.length - this.mapObj.pick)%2 == 0) ? 0 : 1;
        this.mapObj.ban = (maps.length - this.mapObj.pick) - isPair - Json.voteSet.mapLeft[this.mapObj.mapNumb];

        // Just for a beautiful title
        let nick = {};
        nick.one = Global.Fn.getNick(msg, this.plObj.pl1.user.id);
        nick.two = Global.Fn.getNick(msg, this.plObj.pl2.user.id);
        let teamsTitle = this.plObj.teams ? `[${this.plObj.pl1.team}] vs [${this.plObj.pl2.team}]` : `${this.plObj.pl1.team} vs ${this.plObj.pl1.team}`;
        this.plObj.title = `${teamsTitle} (Bo${this.mapObj.mapNumb})`;
    }

    async run(query) {
        const msg = this.msg;
        const plObj = this.plObj;
        const mapObj = this.mapObj;
        const bot = this.bot;

        let Guild = bot.tempGuilds[msg.guild.id];
        let lang = Guild.lang;
        let prefix = Guild.prefix;

        // Make channel "on use"
        if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteCap--;
        if(Guild.voteCap == 1) bot.tempGuilds[msg.guild.id].voteMax = true;
        bot.tempGuilds[msg.guild.id].channels[msg.channel.id].vote = true;

        msg.channel.send({embed: { title: "Loading", description: `Creating Vote #${Global.Fn.randomNumber(10000, 99999999)}`}})
        .then((omsg) => {

            // ---------------------------------------------------------------------
            // --------------------------- PREPARING VOTE --------------------------
            // ---------------------------------------------------------------------             
            let chanName = omsg.channel.name;
            let RegUse = new RegExp(Json.voteSet.outUse, 'g');
            chanName = chanName.replace(RegUse, "");
            RegUse = new RegExp(Json.voteSet.inUse, 'g');
            chanName = chanName.replace(RegUse, "");
            chanName = chanName + Json.voteSet.inUse;
            omsg.channel.edit({ name: chanName })
            .catch(console.error);


            let embed = Global.Ebd.vote(omsg, plObj, mapObj, lang, prefix);
            omsg.edit({embed})
            .catch(console.error)

            let mapIndex = 0;
            let dispMapArr = [];
            let lastMap = [];

            const voteCollector = new Discord.MessageCollector(omsg.channel, m => ((m.author.id === plObj.pl1.user.id) || (m.author.id === plObj.pl2.user.id)));
            voteCollector.on("collect", message => {
                let args = message.content.split(" "); // Message arguments
                Guild = bot.tempGuilds[msg.guild.id];
                lang = Guild.lang;
                prefix = Guild.prefix;




                // ---------------------------------------------------------------------
                // ------------------------------ SHIELD -------------------------------
                // ---------------------------------------------------------------------
                if (message.author.bot) return; // Is bot
                message.delete();
                if(!message.content.startsWith(prefix)) return // No prefix
                if(message.content.startsWith(prefix+"cancel")) { // Someone canceled
                    // Change channel name
                    chanName = message.channel.name;
                    chanName = chanName.replace(RegUse, "");
                    chanName = chanName + Json.voteSet.outUse;
                    message.channel.edit({ name: chanName })
                    .catch(console.error);

                    // Make this channel free
                    if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteCap++;
                    if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteMax = false;
                    bot.tempGuilds[msg.guild.id].channels[msg.channel.id].vote = false;

                    Global.Msg.edit(omsg, {embed: {title: "Vote annulé", description: "Ce message disparaitra dans 10s."}});
                    voteCollector.stop("canceled");
                    return
                     
                    /********************************************************************
                    ******************************** END ********************************
                    ********************************************************************/
                }

                let shieldReg = new RegExp("ban|pick|next|end|translate");
                if(args[0].match(shieldReg) == null) return // Not a cmd
                



                
                // ---------------------------------------------------------------------
                // ----------------------------- TRANSLATE -----------------------------
                // ---------------------------------------------------------------------
                if((args[0] == prefix + "translate") && mapObj.manualDisplay) {
                    shieldReg = new RegExp(Json.langs.regex);
                        if(!args[1]) return Global.Msg.reply(message, `${Json.langs.vote.langList} \`${Json.langs.regex}\``, 5);
                        if(args[1].match(shieldReg) == null) return Global.Msg.reply(message, Json.langs.vote.langUnkn, 5);
                        if((mapObj.pick == 0) && (mapObj.ban == 0)) {
                            embed = Global.Ebd.map(plObj, mapObj, mapIndex, dispMapArr[mapIndex], args[1], prefix);
                            omsg.edit({ embed });
                            return
                        }
                        embed = Global.Ebd.vote(message, plObj, mapObj, args[1], prefix);
                        omsg.edit({ embed });
                        return
                }



                
                // ---------------------------------------------------------------------
                // -------------------------------- BAN --------------------------------
                // ---------------------------------------------------------------------
                if((args[0] == prefix + "ban")) {
                    if(VoteAction.match(bot, message, plObj, mapObj, "ban")) {
                        return VoteAction.run(bot, omsg, message, plObj, mapObj, "ban", "banned");
                    }
                }




                // ---------------------------------------------------------------------
                // -------------------------------- PICK -------------------------------
                // ---------------------------------------------------------------------
                if(((args[0] == prefix + "pick") && (mapObj.pick > 0))) {
                    if(VoteAction.match(bot, message, plObj, mapObj, "pick")) {
                        VoteAction.run(bot, omsg, message, plObj, mapObj, "pick", "picked");
                    }
                    if(mapObj.pick == 0) {
                        omsg.edit({embed: {title: "Loading", description: "Map en cours de chargement."}});

                        // Pushing maps picked and maps left into arrays
                        mapObj.mapsArr.forEach((map) => {
                            if(map.picked) {
                                dispMapArr.push(map);
                            } else if(!map.picked && !map.banned) {
                                lastMap.push(map);
                            }
                        });
                        // Shuffle arrays for a random maps sequences
                        Global.Fn.shuffle(dispMapArr);
                        Global.Fn.shuffle(lastMap);
                        // Push first map left (non-picked) into picked maps array (random last map)
                        dispMapArr.push(lastMap[0]);
                    
                        embed = Global.Ebd.map(plObj, mapObj, mapIndex, dispMapArr[mapIndex], lang, prefix);
                        omsg.edit({embed})
                        .then((msg) => {
                            if(!mapObj.manualDisplay) {
                                setTimeout(() => {
                                    msg.delete()
                                }, (1000*(60*90)))
                            }
                        })
                        mapIndex++;
                    }
                }




                if((mapObj.pick == 0) && (mapObj.ban == 0)) {
                    // ---------------------------------------------------------------------
                    // --------------------------- AUTO DISPLAY ----------------------------
                    // ---------------------------------------------------------------------
                    if(!mapObj.manualDisplay) {
                        // Foreach map -> Display
                        for(let i = 0; i < mapObj.mapNumb; i++) {
                            embed = Global.Ebd.map(plObj, mapObj, i, dispMapArr[i], lang, prefix);
                            Global.Msg.embed(message, embed, (60*90));
                        }

                        // Make this channel free
                        if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteCap++;
                        if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].votCax = false;
                        bot.tempGuilds[msg.guild.id].channels[msg.channel.id].vote = false;

                        // Change channel name
                        chanName = message.channel.name;
                        chanName = chanName.replace(RegUse, "");
                        chanName = chanName + Json.voteSet.outUse;
                        message.channel.edit({ name: chanName })
                        .catch(console.error);

                        return voteCollector.stop("ended");
                     
                        /********************************************************************
                        ******************************** END ********************************
                        ********************************************************************/
                    }




                    // ---------------------------------------------------------------------
                    // -------------------------- MANUAL DISPLAY ---------------------------
                    // ---------------------------------------------------------------------
                    if((args[0] == prefix + "next")) {
                        embed = Global.Ebd.map(plObj, mapObj, mapIndex, dispMapArr[mapIndex], lang, prefix);
                        omsg.edit({embed});
                        mapIndex++;

                        if(mapIndex == mapObj.mapNumb) {
                            setTimeout(() => {
                                Global.Msg.edit(omsg, {embed: {title: "Match terminé", description: "Bien joué à tous les participants !"}}, 10);

                                // Make this channel free
                                if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteCap++;
                                if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteMax = false;
                                bot.tempGuilds[msg.guild.id].channels[msg.channel.id].vote = false;

                                // Change channel name
                                chanName = message.channel.name;
                                chanName = chanName.replace(RegUse, "");
                                chanName = chanName + Json.voteSet.outUse;
                                message.channel.edit({ name: chanName })
                                .catch(console.error);

                            }, (1000*120));

                            voteCollector.stop("ended");
                     
                            /********************************************************************
                            ******************************** END ********************************
                            ********************************************************************/
                        }
                        return
                    }

                    if((args[0] == prefix + "end")) {
                        // Change channel name
                        chanName = message.channel.name;
                        chanName = chanName.replace(RegUse, "");
                        chanName = chanName + Json.voteSet.outUse;
                        message.channel.edit({ name: chanName })
                        .catch(console.error);

                        // Make this channel free
                        if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteCap++;
                        if(Guild.voteCap > 1) bot.tempGuilds[msg.guild.id].voteMax = false;
                        bot.tempGuilds[msg.guild.id].channels[msg.channel.id].vote = false;
        
                        Global.Msg.edit(omsg, {embed: {title: "Match terminé", description: "Merci à tous les participants !"}}, 10);
                        voteCollector.stop("ended");
                     
                        /********************************************************************
                        ******************************** END ********************************
                        ********************************************************************/
                    }
                }

                return
            });
        })
        .catch(err => console.error(err));
    }
}