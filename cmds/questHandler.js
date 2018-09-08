'use strict'

const Json = require('../json/');
const Global = require("../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class NewUserCommand {

    static run(msg, userQuest, mongoColl, mongoAction = "create") {
        let questNumber = 0, objColl = {};
      
      console.log(userQuest.steps[0].question())
        const Q = Global.Fn.waitFor(userQuest.steps[0].question())
        msg.author.send("test")
            .then((omsg) => {
      
                const questCollector = new Discord.MessageCollector(omsg.channel, 1000*60*60);
                questCollector.on("collect", message => {

                    // User canceled
                    if(message == "stop!!") {
                        return questCollector.stop("canceled");
                    }

                    Global.Fn.waitFor(userQuest.questions[questNumber].answer(message))
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
                                    omsg.edit(Global.Fn.waitFor(userQuest.questions[questNumber].question()))
                                    break;
                                case "skip":
                                    questNumber++
                                    omsg.edit(Global.Fn.waitFor(userQuest.questions[questNumber].question()))
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

                })
          
                console.log(questCollector.ended)
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
            .catch(err => console.error(err));
      
    };
}