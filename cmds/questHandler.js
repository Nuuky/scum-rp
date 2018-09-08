'use strict'

const Json = require('../json/');
const Global = require("../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class NewUserCommand {

    static run(msg, userQuest, mongoColl, mongoAction = "create") {
        let questNumber = 0, objColl = {}
      
        let embed = userQuest.steps[0].question()
        console.log(embed)
        msg.author.send({embed})
        .then(omsg => {

            console.log("Author ID: ", msg.author.id)
    
            const questCollector = new Discord.MessageCollector(omsg.channel, m => m.author.id === msg.author.id, { time: 10000*60*60 });
            console.log("Collector created !")
            questCollector.on("collect", message => {
                console.log("Collecting Quest " + (questNumber + 1) + " of " + userQuest.steps.length + "...")
    
                // User canceled
                if(message == "stop!!") {
                    console.log("Canceling...")
                    return questCollector.stop("canceled");
                }
    
                Global.Fn.waitFor(userQuest.steps[questNumber].answer(message))
                    .then((obj) => {
                        console.log("Treating answer...")
                  
                        
                        switch(obj[0]) {
                            case "save":
                                if(obj[1].obj) {
                                    if(!objColl[obj[1].name]) objColl[obj[1].name] = {}
                                    objColl[obj[1].name][obj[1].inner] = obj[1].content;
                                } else {
                                    objColl[obj[1].name] = obj[1].content;
                                }
                                questNumber++
                                if(questNumber >= userQuest.steps.length)  return questCollector.stop("save");
                                Global.Fn.waitFor(userQuest.steps[questNumber].question())
                                .then(emd => {
                                    console.log("EMD: ", emd);
                                    msg.author.send({embed: emd})
                                    .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
                                break;
                            
                            case "skip":
                                questNumber++
                                if(questNumber >= userQuest.steps.length)  return questCollector.stop("save");
                                Global.Fn.waitFor(userQuest.steps[questNumber].question())
                                .then(emd => {
                                    console.log("EMD: ", emd);
                                    msg.author.send({embed: emd})
                                    .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
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
                    let authID = msg.author.id.replace("<", "")
                    authID = msg.author.id.replace(">", "")
                    Global.Fn.mongUpdate(objColl, mongoAction, mongoColl)

                    // Update Groupe DB
                    if(objColl.groupe) {
                        let grpUpdt = {
                            $inc: {
                                pending: 1
                            },
                            $addToSet: { 
                                members: {
                                    id: authID, 
                                    pending: objColl.groupe.pending
                                }
                            }
                        }
                        Global.Fn.mongUpdate({_id: objColl.groupe.id}, "update", "groupe_info", grpUpdt)
                    }

                    // Update Religion DB
                    if(objColl.religion) {
                        let relUpdt = {
                            $inc: {
                                pending: 1
                            },
                            $addToSet: { 
                                members: {
                                    id: authID, 
                                    pending: objColl.religion.pending
                                }
                            }
                        }
                        Global.Fn.mongUpdate({_id: objColl.religion.id}, "update", "religion_info", relUpdt)
                    }

                    msg.author.send({embed: {
                        "title": "**Succès !**",
                        "description": `Votre profile a été créé avec succès !\n
                            Vous pouvez dés à présent consulter votre carte d'identité en tappant:\n
                            \`${Json.cfg.bot.prefix}who pseudoIG\`\n
                            \`${Json.cfg.bot.prefix}who @pseudoDisc\``
                    }})
                }
              
                console.log("Ended.")
            })
        })
        .catch(err => console.error(err))
      
    };
}