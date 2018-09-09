'use strict'

const Json = require('../json/');
const Global = require("../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class QuestionHandler {

    static run(msg, userQuest, mongoColl, mongoAction = "create") {
        let questNumber = 0, 
            objColl = {},
            createData = (mongoAction == "create") ? true : false;
            questToDo = (createData) ? userQuest.steps.length : 1
      
        let embed = (createData) ? userQuest.steps[0].question() : userQuest.update.question()
        console.log(embed)
        msg.author.send({embed})
        .then(omsg => {    
            const questCollector = new Discord.MessageCollector(omsg.channel, m => m.author.id === msg.author.id, { time: 10000*60*60 });
            console.log("Collector created !")
            questCollector.on("collect", message => {
                console.log("Collecting Quest " + (questNumber + 1) + " of " + questToDo + "...")
    
                // User canceled
                if(message == "stop") {
                    console.log("Canceling...")
                    return questCollector.stop("canceled");
                }
                
                firstAnswer = (createData) ? userQuest.steps[questNumber].answer(message) : userQuest.update.answer(message)
                Global.Fn.waitFor(firstAnswer)
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
                                if(questNumber >= questToDo)  return questCollector.stop("save");
                                Global.Fn.waitFor(userQuest.steps[questNumber].question())
                                .then(emd => {
                                    msg.author.send({embed: emd})
                                    .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
                                break;
                            
                            case "skip":
                                questNumber++
                                if(questNumber >= questToDo)  return questCollector.stop("save");
                                Global.Fn.waitFor(userQuest.steps[questNumber].question())
                                .then(emd => {
                                    msg.author.send({embed: emd})
                                    .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
                                break;

                            case "next":
                                questNumber++
                                Global.Fn.waitFor(userQuest.steps[obj[1].questIndex].question())
                                .then(emd => {
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
                if(reason == "save") {
                    Global.Fn.mongUpdate({$set: objColl}, mongoAction, mongoColl)

                    // Update Groupe DB
                    if(objColl.groupe) Global.Fn.mongUpdate({_id: objColl.groupe.id}, "update", "groupe_info", { $addToSet: {pending: msg.author.id} })

                    // Update Religion DB
                    if(objColl.religion) Global.Fn.mongUpdate({_id: objColl.religion.id}, "update", "religion_info", { $addToSet: {pending: msg.author.id} })

                    msg.author.send({embed: {
                        "title": "**Succès !**",
                        "description": `Votre profile a été créé avec succès !\n
                            Vous pouvez dés à présent consulter votre carte d'identité en tappant:\n
                            \`${Json.cfg.bot.prefix}who pseudoIG\`\n
                            \`${Json.cfg.bot.prefix}who @pseudoDisc\``
                    }})
                }
              
                msg.author.send("Action annulé.")
              
                console.log("Ended.")
            })
        })
        .catch(err => console.error(err))
      
    };
}