'use strict'

const Json = require('../json/');
const Fn = require("./functions.js");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class QuestionHandler {

    async run(msg, userQuest, mongoColl, mongoAction = "create") {
        let objColl = {},
            createData = (mongoAction == "create") ? true : false,
            questIndex = (createData) ? 1 : 0,
            questNumber = 0,
            questToDo = (createData) ? userQuest.steps.length : 2;
      
        let embed = userQuest.steps[questIndex].question()
        msg.author.send({embed})
        .then(omsg => {    
            const questCollector = new Discord.MessageCollector(omsg.channel, m => m.author.id === msg.author.id, { time: 10000*60*60 });
            console.log("Collector created !")
            questCollector.on("collect", message => {
                console.log("Collecting Quest " + (questIndex + 1) + " of " + questToDo + "...")
    
                // User canceled
                if(message == "stop") {
                    console.log("Canceling...")
                    return questCollector.stop("canceled");
                }
                console.log(questIndex);
                Fn.waitFor(userQuest.steps[questIndex].answer(message))
                    .then((obj) => {
                        console.log("Treating answer...")
                  
                        
                        console.log("case: ", obj[0])
                        switch(obj[0]) {
                            case "skip":
                                if(obj[1].obj) {
                                    if(!objColl[obj[1].name]) objColl[obj[1].name] = {}
                                    objColl[obj[1].name][obj[1].inner] = obj[1].content;
                                } else {
                                    objColl[obj[1].name] = obj[1].content;
                                }
                                questNumber++
                                questIndex++
                                if(questNumber >= (questToDo - 1))  return questCollector.stop("save");
                                Fn.waitFor(userQuest.steps[questIndex].question())
                                .then(emd => {
                                    msg.author.send({embed: emd})
                                    .catch(err => console.error(err))
                                })
                                .catch(err => console.error(err))
                                break;

                            case "next":
                                console.log("obj[1]: ", obj[1])
                                questIndex = obj[1].dataIndex
                                questNumber++
                                Fn.waitFor(userQuest.steps[questIndex].question())
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
                        Fn.waitFor(Fn.findData("findOne", mongoColl, {_id: msg.author.id}))
                        .then(User => {
                            if((User.groupe && objColl.groupe) && User.groupe != objColl.groupe) {
                                Fn.waitFor(Fn.findData("findOne", "groupe_info", {_id: User.groupe}))
                                .then(grp => {
                                    let members = grp.members
                                    for( var i = 0; i < members.length-1; i++){ 
                                        if ( members[i].id == msg.author.id ) {
                                            members.splice(i, 1); 
                                        }
                                    }
                                    Fn.mongUpdate({_id: User.groupe}, "update", "groupe_info", { $set:{"members":members} })
                                })
                            }
                            
                            if((User.religion && objColl.religion) && User.religion != objColl.religion) {
                                Fn.waitFor(Fn.findData("findOne", "religion_info", {_id: User.religion}))
                                .then(grp => {
                                    let members = grp.members
                                    for( var i = 0; i < members.length-1; i++){ 
                                        if ( members[i] == msg.author.id ) {
                                            members.splice(i, 1); 
                                        }
                                    }
                                    Fn.mongUpdate({_id: User.religion}, "update", "religion_info", { $set:{"members":members} })
                                })
                            }
                            console.log("objColl: ", objColl)
                            Fn.mongUpdate({_id: msg.author.id}, "update", mongoColl, {$set: objColl})
                        })
                    }

                    if(createData) Fn.mongUpdate(objColl, mongoAction, mongoColl)

                    const newPendingMember = { $addToSet: {members: {id: msg.author.id, pending: true}}}
                    // Update Groupe DB
                    if(objColl.groupe) Fn.mongUpdate({_id: objColl.groupe}, "update", "groupe_info", newPendingMember)

                    // Update Religion DB
                    if(objColl.religion) Fn.mongUpdate({_id: objColl.religion}, "update", "religion_info", newPendingMember)

                    embed = {
                        "title": "**Succès !**",
                        "description": `Les informations ont bien été prises en comptes.`
                    }

                    return msg.author.send({embed})
                }
              
                msg.author.send("Action annulé.")
              
                console.log("Ended.")
            })
        })
        .catch(err => console.error(err))
      
    };
}