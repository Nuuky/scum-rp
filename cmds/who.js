'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');

module.exports = class WhoCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const rpData = this.bot.tempScum;


        // SEARCH USER --------
        if(query) {
            let info, user, religion, groupe;

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


            const getUser = () => {
                const promise = new Promise((resolve, reject) => {
                    resolve(Global.Fn.findData("findOne", "user_info", searchObj));
                })
                return promise
                const userInfo = await 
                user = userInfo;
                console.log(user)

                if(await userInfo) cb;
            }

            const getGroupesInfo = () => {
                const promise = new Promise((resolve, reject) => {
                    resolve([Global.Fn.findData("findOne", "religion_info", {_id: "5b8ef088fb6fc013752b7799"}), Global.Fn.findData("findOne", "groupe_info", {_id: "5b8eee97fb6fc013752b76a0"})])
                })
            }

            const makeList = () => {
            }

            getUser()
            .then(getGroupesInfo)
            .then(() => {
                console.log("then User: " + user);
                console.log("then Religion: " + religion);
                console.log("then Groupe: " + groupe);

                // Get religion name
                if(religion) {
                    info.desc = religion.name + ((religion.leader == user._id) ? " 🌟\n" : "\n");
                }
    
                // Get groupe name
                if(groupe) {
                    let groupeStr = groupe.name + ((groupe.leader == user._id) ? " 👑\n" : "\n");
                    info.desc = groupeStr.concat(info.desc);
                }
            
                (user.age + "\n").concat(info.desc);
    
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
                        "url": (user.image) ? user.image : "null"
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

                Global.Msg.embed(msg, embed, 90);
            })
            .catch(err => console.error(err))
        }
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