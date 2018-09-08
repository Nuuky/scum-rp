'use strict'

const Json = require('../json/');
const Fn = require("./functions.js");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class UpdateHandler {

    static run(msg, userQuest) {
        let questNumber = 0, indexData;
      
        let embed = userQuest.steps[0].question()
        msg.author.send({embed})
        .then(omsg => {
    
            const questCollector = new Discord.MessageCollector(omsg.channel, m => m.author.id === msg.author.id, { time: 10000*60*60 });
            console.log("Collector created !")
            questCollector.on("collect", message => {
                console.log("Collecting Quest " + (questNumber + 1) + " of " + userQuest.steps.length + "...")
    
                // User canceled
                if(message == "stop") {
                    console.log("Canceling...")
                    return questCollector.stop("canceled");
                }
    
                Global.Fn.waitFor(userQuest.steps[questNumber].answer(message, indexData))
                    .then((obj) => {
                        console.log("Treating answer...")
                  
                        
                        switch(obj[0]) {
                            case "next":
                                indexData = obj[1].data
                                questNumber++
                                if(questNumber >= userQuest.steps.length)  return questCollector.stop("save");
                                Global.Fn.waitFor(userQuest.steps[questNumber].question(indexData))
                                .then(emd => {
                                    msg.author.send({embed: emd})
                                    .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
                                break;
                            
                            case "skip":
                                questNumber++
                                if(questNumber >= userQuest.steps.length)  return questCollector.stop("save");
                                Global.Fn.waitFor(userQuest.steps[questNumber].question(indexData))
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
              
                if(reason == "canceled") return false 
                if(reason == "save") {
                    msg.author.send({embed: {
                        "title": "**Succès !**",
                        "description": `Information modifié avec succès`
                    }})
                }
              
                console.log("Ended.")
            })
        })
        .catch(err => console.error(err))
      
    };
}