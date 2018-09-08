'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")


const userDefData = [
    {data: "name", "name": "Nom", def: "Votre nom"},
    {data: "age", "name": "Age",  def: "Votre age"},
    {data: "style", "name": "Apparence",  def: "Votre Sexe / Tête / Tatouage"},
    {data: "job", "name": "Métier",  def: "Votre métier"},
    {data: "hostility", "name": "Hostilité",  def: "Votre hostilité"},
    {data: "crimes", "name": "Crime(s)",  def: "Vos crimes (Ou pas)"},
    {data: "groupe", "name": "Groupe",  def: "Votre groupe"}, 
    {data: "religion", "name": "Religion",  def: "Votre religion"},
    {data: "description", "name": "Background",  def: "Votre description"}
]

module.exports = {
    steps: [
        {
            "question": () => {
                let dataQuest = "";

                userDefData.forEach((entry, index) => {
                    dataQuest += entry.name + ": `" + index + "`\n"
                })

                let embed = {
                    "title": "**Modification de votre profile**",
                    "description": "Veuillez choisir l'information à modifier par son numéro.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": dataQuest
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                let dataToUpdt;
                if(!isNaN(msg.content) && (msg.content >= 0 && msg.content <= userDefData.length - 1)) dataToUpdt = msg.content
                if(dataToUpdt) return ["next", {data: dataToUpdt}]
                else {
                    msg.author.send("Erreur: Veuillez répondre avec l'un des thermes proposés.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*60)})
                }
            }
        },



        {
            "question": (dataObj) => {
                let embed = {
                    "title": "**Modification de votre " + userDefData[dataObj].name + "**"
                }

                switch(userDefData[dataObj].data) {
                    case "groupe":
                        return Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
                        .then(groupeArr => {
                            let groupes = ""
                            groupeArr.forEach(groupe => {
                                groupes += "`" + Global.Fn.capitalize(groupe.name) + "`\n"
                            })
                            
                            embed.description = "⚠️ Vous devez choisir un groupe qui existe déjà !\nTappez `stop` pour annuler"
                            embed.fields = [
                                    {
                                        "name": "Réponses",
                                        "value": groupes
                                    }
                                ]
                            return embed
                        })
                        break;
                    case "religion":
                        return Global.Fn.waitFor(Global.Fn.findData("find", "religion_info", {}))
                        .then(religionArr => {
                            let religions = ""
                            religionArr.forEach(religion => {
                                religion += "`" + Global.Fn.capitalize(religion.name) + "`\n"
                            })
                            
                            embed.description = "⚠️ Vous devez choisir une religion qui existe déjà !\nTappez `stop` pour annuler"
                            embed.fields = [
                                    {
                                        "name": "Réponses",
                                        "value": religions
                                    }
                                ]
                            return embed
                        })
                        break;

                    case "crimes":
                        let crimes = "";
                        Json.scumData.crimes.forEach(crime => {
                            crimes += "`" + crime + "` "
                        })
                        embed.description = "⚠️ Vous êtes limité aux choix proposés.\nTappez `stop` pour annuler"
                        embed.fields = [
                                {
                                    "name": "Réponses",
                                    "value": crimes
                                }
                            ]
                        return embed;
                        break;
                        
                case "job":
                    let jobs = "";
                    Json.scumData.jobs.forEach(job => {
                        jobs += "`" + job + "` "
                    })
                    embed.description = "⚠️ Vous êtes limité aux choix proposés.\nTappez `stop` pour annuler"
                    embed.fields = [
                            {
                                "name": "Réponses",
                                "value": jobs
                            }
                        ]
                    return embed;
                    break;

                case "hostility":
                    embed.description = "⚠️ Vous êtes limité aux choix proposés.\nTappez `stop` pour annuler"
                    embed.fields = [
                            {
                                "name": "Réponses",
                                "value": "`Amicale` `Méfiant` `Hostile`"
                            }
                        ]
                    return embed;
                    break;

                    default:
                        return embed
                        break;
                }
            },
            "answer": (msg, data) => {
                if(data.data.match("groupe|religion")) {
                    const collName = data.data + "_info"
                    return Global.waitFor(Global.Fn.findData("findOne", collName, {name: msg.content.toLowerCase()}))
                    .then(obj => {
                        if(!obj) {
                            return msg.channel.send("Erreur: " + data.name + " introuvable.")
                                .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                        }
                        let objUpdt = {$set: {}}
                        objUpdt.$set[data.data] = {
                            id: obj._id,
                            pending: obj.pending + 1
                        }
                        Global.Fn.mongUpdate({_id: msg.author.id}, "update", "user_info", objUpdt)
                        return ["end", true]
                    })
                } 
                
                
                else if(data.data.match("job|hostility")) {
                    let exist = false;
                    Json.scumData.jobs.forEach(job => {
                        if(job.toLowerCase() == msg.content) exist = true
                    })
                    if(msg.content.toLowerCase().match("amicale|méfiant|hostile")) exist = true
                    if(!exist) return msg.channel.send("Erreur: " + data.name + " introuvable.")
                        .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                    
                    let objUpdt = {$set: {}}
                    objUpdt.$set[data.data] = msg.content;
                    Global.Fn.mongUpdate({_id: msg.author.id}, "update", "user_info", objUpdt)
                    return ["end", true]
                } 
                
                
                else if(data.data.match("crimes")) {
                    let userCrimes = msg.content.toLowerCase().replace(" ", "")
                    userCrimes = userCrimes.split(",")
                    if(userCrimes.length > 2) return msg.channel.send("Erreur: Vous avez selectionné trop de crimes.")
                    .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))

                    userCrimes.forEach(userCrime => {
                        let exist = false
                        Json.scumData.crimes.forEach(crime => {
                            if(crime == userCrime) exist = true
                        })
                        if(!exist) return msg.channel.send("Erreur: L'un des crimes selectionné n'existe pas.")
                        .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                    })

                    let objUpdt = {$set: {}}
                    objUpdt.$set[data.data] = userCrimes;
                    Global.Fn.mongUpdate({_id: msg.author.id}, "update", "user_info", objUpdt)
                    return ["end", true]
                } 
                
                
                else if(data.data.match("sex|head|tatoo")) {
                    if(!msg.content.toLowerCase().match("homme|femme") || !isNaN(msg.content)) return msg.channel.send("Erreur: Réponse incorrecte.")
                    .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))

                    let dataDef;

                    if(data.data == "sex") {
                        if(isNaN(msg.content)) return msg.channel.send("Erreur: Votre sexe ne peux pas être numérique !.")
                        .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                        dataDef = (msg.content.toLowerCase() == "homme") ? 0 : 1
                    }

                    if(data.data == "head") {
                        if(!msg.content >= 1 && !msg.content <= 4) return msg.channel.send("Erreur: Numéro de tête incorrecte.")
                        .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                        dataDef = msg.content
                    }

                    else {
                        if(!msg.content >= 0 && !msg.content <= 4) return msg.channel.send("Erreur: Numéro de tête incorrecte.")
                        .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                        dataDef = msg.content
                    }

                    let objUpdt = {$set: {style: {}}}
                    objUpdt.$set.style[data.data] = dataDef;
                    Global.Fn.mongUpdate({_id: msg.author.id}, "update", "user_info", objUpdt)
                    return ["end", true]
                }

                else {
                    if(data.data == "age" && !isNaN(msg.data)) return msg.channel.send("Erreur: Age incorrecte.")
                    .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
                    if(!(data.data == "age" && (msg.content >= 20 && msg.content <= 50))) return msg.channel.send("Erreur: Age incorrecte (20 -> 50).")
                    .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))

                    if(data.data == "description" && msg.content.length > 1024) return msg.channel.send("Erreur: Texte trop long, enlevez `" + msg.content.length - 1024 + "` caractère.")
                    .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))

                    let objUpdt = {$set: {}}
                    objUpdt.$set[data.data] = msg.content;
                    Global.Fn.mongUpdate({_id: msg.author.id}, "update", "user_info", objUpdt)
                    return ["end", true]
                }
            }
        }
    ]
}