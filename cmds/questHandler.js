'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")
const userQuest = require("questions.js")

module.exports = class NewUserCommand {

    static run(msg, mongoColl, mongoAction = "create") {
        let questNumber = 0, objColl = {};
      
        msg.author.send(userQuest.steps[0].question)
            .then((omsg) => {
      
                const Collector = new Discord.MessageCollector(omsg.channel, {"time": 1000*60*60});
                Collector.on("collect", message => {

                    // User canceled
                    if(message == "stop!!") {
                        return Collector.stop("canceled");
                    }

                    const treatAnsw = () => {
                        const promise = new Promise((resolve, reject) => {
                            resolve(userQuest.questions[questNumber].answer(message))
                        })
                        return promise
                    }
                    treatAnsw()
                    .then((obj) => {
                        switch(obj.action) {
                            case "save":
                                objColl[obj.data.name] = obj.data.content;
                                questNumber++
                                omsg.edit(userQuest.questions[questNumber].question)
                                break;
                            case "skip":
                                questNumber++
                                omsg.edit(userQuest.questions[questNumber].question)
                                break;

                            case "end":
                                // Bot canceled (With User approbation)
                                if(!obj.save) return Collector.stop("canceled");
                                // Collection end
                                else return Collector.stop("save");
                                break;

                            default:
                        }
                    })
                    

                })
                .on("end", (collected, reason) => {
                    if(reason == "canceled") return false
                    if(reason == "save") return Global.Fn.mongUpdate(objColl, mongoAction, mongoColl)
                })

            });
      
    };
}