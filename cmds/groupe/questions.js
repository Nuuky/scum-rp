'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

const userDefData = [
    {data: "name", "name": "Nom"},
    {data: "logo", "name": "Logo"},
    {data: "activity", "name": "Activité"},
    {data: "goal", "name": "But"},
    {data: "hostility", "name": "Hostilité"},
    {data: "city", "name": "Ville"},
    {data: "description", "name": "Description"}
]

module.exports = {
    steps: [
        {
            "question": () => {
                let dataQuest = "";

                userDefData.forEach((entry, index) => {
                    dataQuest += "`" + index + "`:" + entry.name + "\n"
                })

                let embed = {
                    "title": "**Modification du profile de votre groupe**",
                    "description": "Veuillez choisir l'information à modifier par son index.\nVous pouvez annuler à tout moment en tappant `stop` !",
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
                // EXEPTIONS -------
                //if(msg.content == 0) return ["end"];
                // DATA -------
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= userDefData.length - 1)) 
                    return msg.author.send("**Erreur:** Veuillez répondre avec l'un des index proposés.")
                        .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*60)})
                // ALL GOOD -------
                const index = 2 + Number(msg.content)
                return ["next", {dataIndex: index}]
            }
        },

        {
            "question": () => {
                let embed = {
                    "title": "**Création d'un groupe**",
                    "description": "⚠️ Vous vous apprêtez à créer un profile de groupe, voulez vous continuer ?\n- Vous pourrez annuler la création à tout moment en tappant `stop`\n- Vous pourrez modifier les informations par la suite en tappant `!grp`",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "`oui` `non`"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                // SHIELD -------
                if(!msg.content.toLowerCase().match("oui|non")) 
                    return msg.author.send("**Erreur:** Veuillez répondre avec l'un des thermes proposés.")
                        .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*60)})
                // ALL GOOD -------
                if(msg.content.toLowerCase() == "non") return ["end"]
                return ["skip", {"name": "leader", "content": msg.author.id}]
            }
        },

        {
            "question": () => {
                let embed = {
                    "title": "**Quel est le nom de votre groupe ?**"
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                // SHIELD -------
                // ALL GOOD -------
                return ["skip", {"name": "name", "content": msg.content.toLowerCase()}]
            }
        },

        {
            "question": () => {
                let embed = {
                    "title": "Avez vous un logo de groupe ?",
                    "description": "Si vous n'avez pas de logo, tappez `skip`\n- URL uniquement\n- Au format .jpg\n- 128px/128px"
                }
                return embed;
            },
            "answer": (msg => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["skip", {"name": "logo", "content": false}]
                // DATA -------
                // SHIELD -------
                if(msg.content.toLowerCase().match(".jpg")) return ["skip", {"name": "logo", "content": msg.content}]
                // ALL GOOD (or not) -------
                msg.author.send("**Erreur:** Votre image n'est pas au format .jpg !")
                .then(omsg => setTimeout(() => {omsg.delete()}, 1000*5))
            })
        },


        
        {
            "question": () => {
                let activities = ""
                Json.scumData.activities.forEach((activity, index) => {
                    activities += `\`${index}\`: ${activity}\n`
                })
                let embed = {
                    "title": "**Quel en sera l'activité principale ?**",
                    "description": "Répondez avec l'index de la tête.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": activities
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                const activities = Json.scumData.activities
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (activities.length + 1))) return msg.author.send("**Erreur:** Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["skip", {"name": "activity", "content": activities[msg.content]}]
            }
        },


        
        {
            "question": () => {
                let goals = ""
                Json.scumData.grpGoals.forEach((goal, index) => {
                    goals += `\`${index}\`: ${goal}\n`
                })
              
                let embed = {
                    "title": "**Quel est le but de votre groupe ? (Précisez si différent de l'activité principale)**",
                    // "description": "Si votre but est semblable à votre activité principale, tappez `skip` pour passer à la question suivante.\nsi vous avez un but, éssayez de faire aussi cours et précis que possible."
                    "description": "Répondez avec l'index de la tête.",
                    "fields": [
                      {
                        name: "Réponses",
                        value: goals
                      }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                const goals = Json.scumData.grpGoals
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (goals.length + 1))) return msg.author.send("**Erreur:** Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["skip", {"name": "activity", "content": goals[msg.content]}]
            }
        },


        
        {
            "question": () => {
                let hostilities = "";

                Json.scumData.hostilities.forEach((host, index) => {
                    hostilities += `\`${index}\`: ${host}\n`
                })

                let embed = {
                    "title": "**Votre groupe sera t-il hostile envers les autres joueurs ?**",
                    "description": "Répondez avec l'index de la réponse.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": hostilities
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                const hostilities = Json.scumData.hostilities
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (hostilities.length + 1))) return msg.author.send("**Erreur:** Hostilité invalide.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["skip", {"name": "hostility", "content": hostilities[msg.content]}]

            }
        },


        
        {
            "question": () => {
                let cities = "";
              
                console.log(Json.cities)

                Json.cities.forEach((city, index) => {
                    if(city.isFree) cities += `\`${index}\`: ${city.name}\n`
                })

                let embed = {
                    "title": "**Votre groupe dispose t-il d'une ville ?**",
                    "description": "Répondez avec l'index de la réponse.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "test"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                const cities = Json.cities
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (cities.length + 1))) return msg.author.send("**Erreur:** Ville invalide.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["skip", {"name": "city", "content": cities[msg.content]}]

            }
        },

        
        {
            "question": () => {
                let embed = {
                    "title": "**Description de votre groupe**",
                    "description": "⚠️ 1024 caractères max\nLa description est obligatoire, elle permettra aux admins d'accepter ou non la création du groupe !"
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["skip", {"name": "description", "content": false}]
                // DATA -------
                // SHIELD -------
                if(msg.content.length > 1024) return msg.author.send("**Erreur:** Votre texte est trop long.\nVous devez enlever `" + msg.content.length - 1024 + "` caractères.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["skip", {"name": "description", "content": msg.content}]
            }
        }
    ]

}