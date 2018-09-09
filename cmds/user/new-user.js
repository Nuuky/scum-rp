'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

const userDefData = [
    {data: "cancel", "name": "annuler", def: "Annuler"},
    {data: "name", "name": "Nom", def: "Votre nom"},
    {data: "sex", "name": "Sexe",  def: "Votre sexe"},
    {data: "age", "name": "Age",  def: "Votre age"},
    {data: "head", "name": "Tête",  def: "Votre tête"},
    {data: "tatoo", "name": "Tatouage",  def: "Votre tatouage"},
    {data: "crimes", "name": "Crime(s)",  def: "Vos crimes (Ou pas)"},
    {data: "job", "name": "Métier",  def: "Votre métier"},
    {data: "hostility", "name": "Hostilité",  def: "Votre hostilité"},
    {data: "groupe", "name": "Groupe",  def: "Votre groupe"}, 
    {data: "religion", "name": "Religion",  def: "Votre religion"},
    {data: "description", "name": "Background",  def: "Votre description"}
]

module.exports = {
    update: {
        "question": () => {
            let dataQuest = "";

            userDefData.forEach((entry, index) => {
                dataQuest += "`" + index + "`:" + entry.def + "\n"
            })

            let embed = {
                "title": "**Modification de votre profile**",
                "description": "Veuillez choisir l'information à modifier par son index.",
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
            if(msg.content == 0) return ["end"];
            // DATA -------
            // SHIELD -------
            if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= userDefData.length - 1)) 
                return msg.author.send("**Erreur:** Veuillez répondre avec l'un des index proposés.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*60)})
            // ALL GOOD -------
            return ["next", {dataIndex: msg.content}]
        }
    },
    steps: [
        {
            "question": () => {
                let embed = {
                    "title": "**Création de profile**",
                    "description": "⚠️ Vous vous apprêtez à créer un profile de personnage, voulez vous continuer ?\n- Vous pourrez annuler la création à tout moment en tappant `stop!!`\n- Vous pourrez modifier les informations par la suite en tappant `!who`",
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
                return ["save", {"name": "_id", "content": msg.author.id}]
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel est le nom de votre personnage ?**"
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                // SHIELD -------
                // ALL GOOD -------
                return ["save", {"name": "name", "content": msg.content}]
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel est le sexe de votre personnage ?**",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "`homme` / `femme`"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                // SHIELD -------
                // ALL GOOD -------
                if(msg.content.toLowerCase() == "homme") return ["save", {"name": "style", "inner": "sex", "content": 0, "obj": true}]
                if(msg.content.toLowerCase() == "femme") return ["save", {"name": "style", "inner": "sex", "content": 1, "obj": true}]
                msg.author.send("**Erreur:** Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },


        
        {
            "question": () => {
                let embed = {
                    "title": "**Quel age a votre personnage ?**",
                    "description": "Ecrivez uniquement des chiffres.",
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 20 && msg.content <= 50)) return msg.author.send("**Erreur:** Réponse invalide.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                    // ALL GOOD -------
                return ["save", {"name": "age", "content": msg.content}]
                
            }
        },


        
        {
            "question": () => {
                let heads = ""
                Json.scumData.heads.forEach((head, index) => {
                    heads += `\`${index}\`: ${head}\n`
                })
                let embed = {
                    "title": "**Quel tête avez-vous choisis ?**",
                    "description": "Répondez avec l'index de la tête.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": heads
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                const heads = Json.scumData.heads
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (heads.length + 1))) return msg.author.send("**Erreur:** Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["save", {"name": "style", "inner": "head", "content": heads[msg.content] - 1, "obj": true}]
            }
        },


        
        {
            "question": () => {
                let tatoos = ""
                Json.scumData.tatoos.forEach((tatoo, index) => {
                    tatoos += `\`${index}\`: ${tatoo}\n`
                })

                let embed = {
                    "title": "**Quel est votre tatouage ?**",
                    "description": "Répondez avec l'index du tatouage.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": tatoos
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                // DATA -------
                const tatoos = Json.scumData.tatoos;
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (tatoos.length + 1))) return msg.author.send("**Erreur:** Réponse invalide.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["save", {"name": "style", "inner": "tatoo", "content": msg.content, "obj": true}]
                
            }
        },


        
        {
            "question": () => {
                let crimes = ""
                Json.scumData.crimes.forEach((crime, index) => {
                    crimes += `\`${index}\`: ${crime}\n`
                })
                let embed = {
                    "title": "**Quel sont vos crimes ?** *(Optionnel)*",
                    "description": "Séparez chaque crimes par une virgules (2 crimes max)\nRépondez avec l'index du crime.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": crimes
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["skip"]
                // DATA -------
                let answArr = msg.content.replace(" ", "")
                answArr = answArr.split(",")
                const crimes = Json.scumData.crimes
                // SHIELD -------
                if(answArr.length > 2) return msg.author.send("**Erreur:** Vous avez selectionné trop de crimes.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                answArr.forEach(crime => {
                    if(isNaN(crime) || !(crime >= 0 && crime <= (crimes.length + 1)) ) return msg.author.send("**Erreur:** Crime invalide.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                })
                // ALL GOOD -------
                let finalAnsw = [];
                answArr.forEach(crime => {
                    finalAnsw.push(crimes[crime])
                })
                return ["save", {"name": "crimes", "content": finalAnsw}]
            }
        },


        
        {
            "question": () => {
                let jobs = ""
                Json.scumData.jobs.forEach((job, index) => {
                    jobs += `\`${index}\`: ${job}\n`
                })

                let embed = {
                    "title": "**Quel est votre métier ?** *(Optionnel)*",
                    "description": "Répondez avec l'index du métier.",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": jobs
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["skip"]
                // DATA -------
                const jobs = Json.scumData.jobs 
                // SHIELD -------
                if(isNaN(msg.content) || !(msg.content >= 0 && msg.content <= (jobs.length + 1)) ) return msg.author.send("**Erreur:** Métier invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["save", {"name": "job", "content": jobs[msg.content]}]
            }
        },


        
        {
            "question": () => {
                let hostilities = "";

                Json.scumData.hostilities.forEach((host, index) => {
                    hostilities += `\`${index}\`: ${host}\n`
                })

                let embed = {
                    "title": "**Quel est votre degré d'hostilé ?**",
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
                return ["save", {"name": "hostility", "content": hostilities[msg.content]}]

            }
        },


        
        {
            "question": () => {
                return Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
                .then(groupeArr => {
                    let groupes = ""
                    groupeArr.forEach(groupe => {
                        groupes += "`" + Global.Fn.capitalize(groupe.name) + "`\n"
                    })
                    let embed = {
                        "title": "**Avez vous un groupe ?** *(Optionnel)*",
                        "description": "⚠️ Vous devez choisir un groupe qui existe déjà !\nTappez `skip` pour ne pas choisir de groupe",
                        "fields": [
                            {
                                "name": "Réponses",
                                "value": groupes
                            }
                        ]
                    }
                    return embed
                })
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["skip"]
                // DATA -------
                return Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {"name": msg.content.toLowerCase()}))
                .then(groupe => {
                    // SHIELD -------
                    if(typeof groupe == 'undefined') msg.author.send("**Erreur:** Le groupe indiqué n'existe pas.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                    // ALL GOOD -------
                    const makeCtt = (groupe) ? "pending" : false
                    return ["save", {"name": "groupe", "content": makeCtt}]

                    
                })
            }
        },


        
        {
            "question": () => {
                return Global.Fn.waitFor(Global.Fn.findData("find", "religion_info", {}))
                .then(religionArr => {
                    let religions = ""
                    religionArr.forEach(religion => {
                        religions += "`" + Global.Fn.capitalize(religion.name) + "`\n"
                    })

                    let embed = {
                        "title": "**Avez vous une religion ?** *(Optionnel)*",
                        "description": "⚠️ Vous devez choisir une religion qui existe déjà !\nTappez `skip` pour ne pas choisir de religion",
                        "fields": [
                            {
                                "name": "Réponses",
                                "value": religions
                            }
                        ]
                    }
                    return embed
                })
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["skip"]
                // DATA -------
                return Global.Fn.waitFor(Global.Fn.findData("findOne", "religion_info", {"name": msg.content.toLowerCase()}))
                .then(religion => {
                    // SHIELD -------
                    if(typeof religion == 'undefined') return msg.author.send("**Erreur:** La religion indiqué n'éxiste pas.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                    // ALL GOOD -------
                    const makeCtt = (religion) ? "pending" : false
                    return ["save", {"name": "religion", "content": makeCtt}]
                })
            }
        },


        
        {
            "question": () => {
                let embed = {
                    "title": "**Background de votre personnage** *(Optionnel)*",
                    "description": "⚠️ 1024 caractères max\nTappez `skip` si vous ne voulez pas écrire de background"
                }
                return embed
            },
            "answer": (msg) => {
                // EXEPTIONS -------
                if(msg.content.toLowerCase() == "skip") return ["end", true]
                // DATA -------
                // SHIELD -------
                if(msg.content.length > 1024) return msg.author.send("**Erreur:** Votre texte est trop long.\nVous devez enlever `" + msg.content.length - 1024 + "` caractères.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                // ALL GOOD -------
                return ["save", {"name": "description", "content": msg.content}]
            }
        }
    ]
}