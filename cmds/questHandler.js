'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")
const userQuest = require("questions.js")

module.exports = class NewUserCommand {

    static run(msg, mongoColl, mongoAction = "create") {
        let questNumber = 0, objColl = {};
      
        msg.author.send(Global.Fn.waitFor(userQuest.steps[0].question()))
            .then((omsg) => {
      
                const Collector = new Discord.MessageCollector(omsg.channel, {"time": 1000*60*60});
                Collector.on("collect", message => {

                    // User canceled
                    if(message == "stop!!") {
                        return Collector.stop("canceled");
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
                                    if(!obj[1]) return Collector.stop("canceled");
                                    // Collection end
                                    else return Collector.stop("save");
                                    break;

                                default:
                                    break;
                            }
                        })

                })
                .on("end", (collected, reason) => {
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

            });
      
    };
}