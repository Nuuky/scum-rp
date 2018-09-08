'use strict'

const Json = require('../json/');
const Global = require("../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class NewUserCommand {

    static run(msg, userQuest, mongoColl, mongoAction = "create") {
        let questNumber = 0, objColl = {};
      
        const userQuests = Global.Fn.waitFor(userQuest.steps[0].question())
            .then(embed => {
                console.log(embed)
                return msg.author.send({embed}) 
            })
            .then((omsg) => {
                console.log("omsg", omsg)
      
                const questCollector = new Discord.MessageCollector(omsg.channel, m => m.author.id === msg.author.id, { time: 10000*60*60 });
                questCollector.on("collect", message => {
                    console.log("Collecting...")
                    console.log("Questions: ", userQuests)

                    // User canceled
                    if(message == "stop!!") {
                        console.log("Canceling...")
                        return questCollector.stop("canceled");
                    }

                    Global.Fn.waitFor(userQuests.steps[questNumber].answer(message))
                        .then((obj) => {
                            switch(obj[0]) {
                                case "save":
                                    if(objColl[obj[1].obj]) {
                                        objColl[obj[1].name] = {}
                                        objColl[obj[1].name][obj[1].inner] = obj[1].content;
                                    } else {
                                        objColl[obj[1].name] = obj[1].content;
                                    }
                                    questNumber++
                                    omsg.edit(Global.Fn.waitFor(userQuests.steps[questNumber].question()))
                                    break;
                                case "skip":
                                    questNumber++
                                    omsg.edit(Global.Fn.waitFor(userQuests.steps[questNumber].question()))
                                    break;

                                case "end":
                                    // Bot canceled (With User approbation)
                                    if(!obj[1]) return questCollector.stop("canceled");
                                    // Collection end
                                    else return questCollector.stop("save");
                                    break;

                                default:
                                    break;
                            }
                        })
                        .catch(err => console.error(err))

                })
                questCollector.on("end", (collected, reason) => {
                    if(reason == "canceled") return false 
                    if(reason == "save") {
                        Global.Fn.mongUpdate(objColl, mongoAction, mongoColl)
                        omsg.edit({
                          "title": "**Succès !**",
                          "description": `Votre profile a été créé avec succès !\n
                              Vous pouvez dés à présent consulter votre carte d'identité en tappant:\n
                              \`${Json.cfg.prefix} who pseudoIG\`\n
                              \`${Json.cfg.prefix} who @pseudoDisc\``
                        })
                    }
                })
            })
            .catch(err => console.error(err))
          
            
      
    };
}