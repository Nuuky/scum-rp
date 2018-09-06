'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');
const ObjectId = require('mongodb').ObjectID;

module.exports = class SearchUserCommand {
    static match(query) {
        const args = query.split(" ");

        // SEARCH USER --------
        let info= {}, user, groupe;

         // GET USER -------
        // Research ID
        let searchObj;
        if(query.startsWith("<@")) {
            let req = args[0].replace("<@", "");
            req = req.replace(">", "");
            searchObj = {_id: req}
        } else {
            searchObj = {fullname: query}
        }

        // Search for User
        const getUser = () => {
            const promise = new Promise((resolve, reject) => {
                console.log("getUser -------")
                resolve(Global.Fn.findData("findOne", "user_info", searchObj))
            })
            return promise
        }
        getUser()
        .then(user => {
            console.log(user);
            if(user) {
                this.user = user;
                return true;
            }
            return
        })
    }

    static run(msg) {
        const user = this.user;
        let info= {}, groupe;

        const getGroupeInfo = (user) => {
            const promise = new Promise((resolve, reject) => {
                console.log("getGroupe -------")
                resolve(Global.Fn.findData("findOne", "groupe_info", {_id: ObjectId(user.groupe)}))
            })
            //console.log(promise)
            return promise
        }

        const getReligionInfo = (groupeInfo) => {
            groupe = groupeInfo;
            const promise = new Promise((resolve, reject) => {
                console.log("getReligion -------")
                resolve(Global.Fn.findData("findOne", "religion_info", {_id: ObjectId(user.religion)}))
            })
            //console.log(promise)
            return promise
        }

        getGroupeInfo()
        .then(getReligionInfo)
        .then((religion) => {

            // console.log("then User: ", user);
            // console.log("then Religion: ", religion);
            // console.log("then Groupe: ", groupe);

            info.desc = user.age + "\n"

            // Get groupe name
            if(groupe) {
                info.desc += groupe.name + ((groupe.leader == user._id) ? " 👑\n" : "\n");
            } else {
                info.desc += "Lone Wolf\n";
            }

            // Get religion name
            if(religion) {
                info.desc += religion.name + ((religion.leader == user._id) ? " 🌟\n" : "\n");
            } else {
                info.desc += "Athés\n";
            }

            // Get Background Story
            if(user.background) {
                console.log("Get Background.");
                info.background = user.background;
            }

            console.log("Startin Embed...");

            // Common Infos
            info.title = "'" + user.name + "'";
            info.color = 10579647;
            info.image = (user.image) ? user.image : "null";

            const embed = {
                "title":  "**" + user.name + "**",
                "description": info.desc,
                "color": info.color,
                "thumbnail": {
                    "url": "https://i.gyazo.com/0023bb1e3275bccbd93c3727607c6152.png"
                }
            }

            if(info.background) {
                embed["fields"] = [
                    {
                        "name": "Background",
                        "value" : info.background,
                    }
                ];
            }

            Global.Msg.embed(msg, embed, 180);
        })
        .catch(err => console.error(err))
    };
}



/* 
    user: {
        "_id": "idObj()",

        "name": "Bilbo Kavasky",

        "age": 32,

        "groupe": "$groupeID",

        "religion": "$religionID",

        "image": "https://i.gyazo.com/0023bb1e3275bccbd93c3727607c6152.png",

        "story": "lorem ipsum"
    }
*/