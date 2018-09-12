'use strict'

const Json = require('../json/');
const Fn = require("./functions.js");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = class QuestionHandler {

    static run(msg, userQuest, mongoColl, mongoAction = "create") {
        let objColl = {},
            createData = (mongoAction == "create") ? true : false,
            questIndex = (createData) ? 1 : 0,
            questNumber = 0,
            questToDo = (createData) ? userQuest.steps.length : 2,
            groupe, religion;

            const User = (createData) ? null : Fn.waitFor(Fn.findData("findOne", mongoColl, {_id: msg.author.id}))
                .then(user => {
                    groupe = Fn.findData("findOne", "groupe_info", {_id: user.groupe});
                    religion = Fn.findData("findOne", "religion_info", {_id: user.religion});
                })
                .catch(e => console.error(e))

      
        let embed = userQuest.steps[questIndex].question()
        msg.author.send({embed})
        .then(omsg => {
            const questCollector = new Discord.MessageCollector(omsg.channel, m => m.author.id === msg.author.id, { time: 10000*60*15 });
            questCollector.on("collect", message => {
    
                // User canceled
                if(message == "stop") return questCollector.stop("canceled");
                
                // Make an obj with the user answer
                Fn.waitFor(userQuest.steps[questIndex].answer(message))
                    .then((obj) => {
                        
                        switch(obj[0]) {
                            case "skip":
                                // Save data in objColl and check if need to end the collection
                                if(obj[1].obj) { // If obj in obj
                                    if(!objColl[obj[1].name]) objColl[obj[1].name] = {}
                                    objColl[obj[1].name][obj[1].inner] = obj[1].content;
                                } else objColl[obj[1].name] = obj[1].content;

                                // 
                                questNumber++
                                questIndex++
                                if(questNumber >= (questToDo - 1))  return questCollector.stop("save");
                                Fn.waitFor(userQuest.steps[questIndex].question())
                                .then(emd => {
                                    msg.author.send({embed: emd})
                                    .catch(e => console.error(e))
                                })
                                .catch(e => console.error(e))
                                break;

                            case "next":
                                // First step update (To get the Question / Answer index)
                                questIndex = obj[1].dataIndex
                                questNumber++
                                Fn.waitFor(userQuest.steps[questIndex].question())
                                .then(emd => {
                                    msg.author.send({embed: emd})
                                    .catch(e => console.error(e))
                                })
                                .catch(e => console.error(e))
                                break;
    
                            case "end":
                                // Bot canceled (With User approbation)
                                if(!obj[1]) return questCollector.stop("canceled");
                                // Collection end
                                else return questCollector.stop("save");
                                break;
    
                            default:
                                // Wrong answer
                                break;
                        }
                    })
                    .catch(e => console.error(e))
    
            })
            questCollector.on("end", (collected, reason) => {
                if(reason == "save") {
                    // If need to save data in DB
                    if(!createData) {
                        // In case of Update
                        if((User.groupe && objColl.groupe) && User.groupe != objColl.groupe) {
                            // Check if need to delete user from his old groupe
                            let members = groupe.members
                            for( var i = 0; i < members.length-1; i++){ 
                                if ( members[i].id == msg.author.id ) {
                                    members.splice(i, 1); 
                                }
                            }
                            Fn.mongUpdate({_id: User.groupe}, "update", "groupe_info", { $set:{"members":members} })
                        }
                        
                        if((User.religion && objColl.religion) && User.religion != objColl.religion) {
                            // Check if need to delete user from his old religion
                                let members = religion.members
                                for( var i = 0; i < members.length-1; i++){ 
                                    if ( members[i] == msg.author.id ) {
                                        members.splice(i, 1); 
                                    }
                                }
                                Fn.mongUpdate({_id: User.religion}, "update", "religion_info", { $set:{"members":members} })
                        }
                        // Update User profile
                        Fn.mongUpdate({_id: msg.author.id}, "update", mongoColl, {$set: objColl})
                    }
                    // Create User profile
                    if(createData) Fn.mongUpdate(objColl, mongoAction, mongoColl)

                    // Push user into ether groupe or religion DB with pending true for groupe (Groupe leader need to approuve user)
                    if(objColl.groupe) Fn.mongUpdate({_id: objColl.groupe}, "update", "groupe_info", { $addToSet: {members: {id: msg.author.id, pending: true}}}) // Update Groupe DB
                    if(objColl.religion) Fn.mongUpdate({_id: objColl.religion}, "update", "religion_info", { $addToSet: {members: msg.author.id}}) // Update Religion DB

                    // End the collection
                    return msg.author.send({embed: {"title": "**Succès !**", "description": `Les informations ont bien été prises en comptes.`}})
                }
                
                // Collection canceled
                msg.author.send("Action annulé.")
                console.log("Ended.")
            })
        })
        .catch(e => console.error(e))
      
    }
}