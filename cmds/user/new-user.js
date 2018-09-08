'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;
const Discord = require("discord.js")

module.exports = {
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
                if(msg.content.toLowerCase() == "oui") {
                    return ["save", {"name": "_id", "content": msg.author.id}]
                } else if(msg.content.toLowerCase() == "non") {
                    return ["end"]
                } else {
                    msg.author.send("Erreur: Veuillez répondre avec l'un des thermes proposés.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*60)})
                }
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
                return ["save", {"name": "name", "content": msg.content}]
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel est le sexe de votre personnage ?**",
                    "description": "Répondez par un nombre",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "`homme` `femme`"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                if(msg.content.toLowerCase() == "homme") return ["save", {"name": "style", "inner": "sex", "content": 0, "obj": true}]
                if(msg.content.toLowerCase() == "femme") return ["save", {"name": "style", "inner": "sex", "content": 1, "obj": true}]
                msg.author.send("Erreur: Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel age a votre personnage ?**",
                    "description": "Ecrivez uniquement le chiffre, n'ajoutez pas \"ans\"",
                }
                return embed
            },
            "answer": (msg) => {
                if(!isNaN(msg.content) && (msg.content >= 20 && msg.content <= 50)) return ["save", {"name": "age", "content": msg.content}]
                msg.author.send("Erreur: Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel tête avez-vous choisis ?**",
                    "description": "Répondez par un nombre",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "`1` -> `4`"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                if(!isNaN(msg.content) && (msg.content >= 1 && msg.content <= 4)) return ["save", {"name": "style", "inner": "head", "content": msg.content - 1, "obj": true}]
                msg.author.send("Erreur: Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel est votre tatouage ?**",
                    "description": "Répondez par un nombre\n⚠️ Si vous n'avez pas de tatouage c'est 0.\n⚠️ Le premium est le numéro 1",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "`0` -> `4`"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                if(!isNaN(msg.content) && (msg.content >= 0 && msg.content <= 4)) return ["save", {"name": "style", "inner": "tatoo", "content": msg.content, "obj": true}]
                msg.author.send("Erreur: Réponse invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel sont vos crimes ?**",
                    "description": "Séparez chaque crimes par une virgules (2 crimes max)\nTappez `skip` si vous êtes innocent.",
                    "fields": [
                        
                    ]
                }
                let crimes = ""
                Json.scumData.crimes.forEach(crime => {
                    crimes += "`" + crime + "` "
                });
                const field = {
                    "name": "Réponses",
                    "value": crimes
                } 
                embed.fields.push(field)

                return embed
            },
            "answer": (msg) => {
                let crimes = msg.content.replace(" ", "")
                crimes = crimes.split(",")

                if(msg.content.toLowerCase() == "skip") return ["save", {"name": "crimes", "content": ["Innocent"]}]

                if(crimes.length <= 2) {
                    crimes.forEach((msgCrime) => {
                        let exist = false
                        Json.scumData.crimes.forEach(crime => {
                            if(msgCrime.toLowerCase() == crime.toLowerCase()) {
                                exist = true;
                            }
                        })
                        if(!exist) {
                            return msg.author.send("Erreur: Crime(s) non valide(s).")
                            .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                        }
                    })
                    return ["save", {"name": "crimes", "content": crimes}]
                }
                msg.author.send("Erreur: Vous avez séléctionnez trop de crimes.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },



        {
            "question": () => {
                let jobs = ""
                Json.scumData.jobs.forEach(job => {
                    jobs += "`" + job + "` "
                })

                let embed = {
                    "title": "**Quel est votre métier ?**",
                    "description": "Tappez `skip` si vous n'avez pas encore choisis de métier.",
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
                if(msg.content.toLowerCase() == "skip") return ["save", {"name": "job", "content": "Vagabond"}]

                let exist = false;
                Json.scumData.jobs.forEach(job => {
                    if(msg.content.toLowerCase() == job.toLowerCase()) exist = true
                })

                if(exist) return ["save", {"name": "job", "content": msg.content}]

                msg.author.send("Erreur: Le métier choisis est invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Quel est votre degré d'hostilé ?**",
                    "fields": [
                        {
                            "name": "Réponses",
                            "value": "`Amicale` `Méfiant` `Hostile`"
                        }
                    ]
                }
                return embed
            },
            "answer": (msg) => {
                let host = ["amicale", "méfiant", "hostile"]

                let exist = false;
                host.forEach(h => {
                    if(msg.content.toLowerCase() == h) exist = true;
                })

                if(exist) return ["save", {"name": "hostility", "content": msg.content}]

                msg.author.send("Erreur: Hostilité invalide.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
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
                        "title": "**Avez vous un groupe ?**",
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
                if(msg.content.toLowerCase() == "skip") return ["save", {"name": "groupe", "content": "Aucun"}]

                return Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {"name": msg.content.toLowerCase()}))
                .then(groupe => {
                    console.log("Groupe Pending: ",groupe.pending)
                    const makeCtt = { "id": groupe._id, "pending": (groupe.pending + 1) }
                    if(groupe) return ["save", {"name": "groupe", "content": makeCtt}]

                    msg.author.send("Erreur: Le groupe indiqué n'éxiste pas.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
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
                        "title": "**Avez vous une religion ?**",
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
                if(msg.content.toLowerCase() == "skip") return ["save", {"name": "religion", "content": "Athés"}]

                return Global.Fn.waitFor(Global.Fn.findData("findOne", "religion_info", {"name": msg.content.toLowerCase()}))
                .then(religion => {
                    const makeCtt = { "id": religion._id, "pending": (religion.pending + 1) }
                    if(religion) return ["save", {"name": "religion", "content": makeCtt}]

                    msg.author.send("Erreur: La religion indiqué n'éxiste pas.")
                    .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
                })
            }
        },



        {
            "question": () => {
                let embed = {
                    "title": "**Background de votre personnage**",
                    "description": "⚠️ 1024 caractères max\nTappez `skip` si vous ne voulez pas écrire de background"
                }
                return embed
            },
            "answer": (msg) => {
                if(msg.content.toLowerCase() == "skip") return ["end", true]
                if(msg.content.length <= 1024) return ["save", {"name": "background", "content": msg.content}]

                msg.author.send("Erreur: Votre texte est trop long.\nVous devez enlever `" + msg.content.length - 1024 + "` caractères.")
                .then(omsg => {setTimeout(() => {omsg.delete()}, 1000*5)})
            }
        }
    ]
}