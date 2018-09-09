'use strict'

const Json = require('../json/');
const Global = require("../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class QuestionHandler {

    static run(msg, userQuest, mongoColl, mongoAction = "create") {
        let objColl = {},
            createData = (mongoAction == "create") ? true : false,
            questNumber = (createData) ? 1 : 0,
            questToDo = (createData) ? userQuest.steps.length : 2;
      
        let embed = userQuest.steps[questNumber].question()
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
                    if(!createData) {
                        Global.waitFor(Global.Fn.findData("findOne", mongoColl, {_id: msg.author.id}))
                        .then(User => {
                            if(User) {
                                if(User.groupe && User.groupe != objColl.groupe.id) {
                                    Global.waitFor(Global.findData("findOne", "groupe_info", {_id: User.groupe}))
                                    .then(grp => {
                                        let members = grp.members
                                        for( var i = 0; i < members.length-1; i++){ 
                                            if ( members[i].id == msg.author.id ) {
                                                members.splice(i, 1); 
                                            }
                                        }
                                        Global.Fn.mongUpdate({_id: User.groupe.id}, "update", "groupe_info", { $set:{"members":members} })
                                    })
                                }
                                
                                if(User.religion && User.religion != objColl.religion.id) {
                                    Global.waitFor(Global.findData("findOne", "religion_info", {_id: User.religion}))
                                    .then(grp => {
                                        let members = grp.members
                                        for( var i = 0; i < members.length-1; i++){ 
                                            if ( members[i] == msg.author.id ) {
                                                members.splice(i, 1); 
                                            }
                                        }
                                        Global.Fn.mongUpdate({_id: User.religion.id}, "update", "religion_info", { $set:{"members":members} })
                                    })
                                }
                            }
                        })
                    }   

                    Global.Fn.mongUpdate({$set: objColl}, mongoAction, mongoColl)

                    const newPendingMember = { $addToSet: {members: {id: msg.author.id, pending: true}}}
                    // Update Groupe DB
                    if(objColl.groupe) Global.Fn.mongUpdate({_id: objColl.groupe.id}, "update", "groupe_info", newPendingMember)

                    // Update Religion DB
                    if(objColl.religion) Global.Fn.mongUpdate({_id: objColl.religion.id}, "update", "religion_info", newPendingMember)

                    embed = {
                        "title": "**Succès !**",
                        "description": `Votre profile a été créé avec succès !\n
                            Vous pouvez dés à présent consulter votre carte d'identité en tappant:\n
                            \`${Json.cfg.bot.prefix}who pseudoIG\`\n
                            \`${Json.cfg.bot.prefix}who @pseudoDisc\``
                    }

                    msg.author.send({embed})
                }
              
                msg.author.send("Action annulé.")
              
                console.log("Ended.")
            })
        })
        .catch(err => console.error(err))
      
    };
}