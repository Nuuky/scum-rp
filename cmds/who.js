'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

module.exports = class WhoCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const rpData = this.bot.tempScum;

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            const dbo = db.db(process.env.DB_NAME);

            // SEARCH USER --------
            if(query) {
                let user, info;

                async function makeList() { // GET USER -------
                  // Research ID
                  let searchObj;
                  if(query.startsWith("<@")) {
                      let req = args[0].replace("<@", "");
                      req = req.replace(">", "");
                      searchObj = {_id: req}
                  } else {
                      searchObj = {fullname: query}
                  }
                  
                  console.log("Searching user..");
                  return dbo.collection("user_info").findOne(searchObj);
                }
                makeList()
                .then(userInfo => {
                    user = userInfo;

                    // Get religion name
                    if(userInfo.religion) {
                        console.log("Searching Religion.");
                        return dbo.collection("religion_info").findOne({_id: userInfo.religion});
                    } else {
                        return
                    } 
                })
                .then(religion => {
                    info.desc = religion.name + ((religion.leader == user._id) ? " 🌟\n" : "\n");
    
                    // Get groupe name
                    if(user.groupe) {
                        console.log("Searching Groupe");
                        return dbo.collection("groupe_info").findOne({_id: user.groupe});
                    } else {
                        return
                    } 
                })
                .then(groupe => {
                    let groupeStr = groupe.name + ((groupe.leader == user._id) ? " 👑\n" : "\n");
                    info.desc = groupeStr.concat(info.desc);
                    (user.age + "\n").concat(info.desc);

                    // Get Background Story
                    if(user.background) {
                        console.log("Get Background.");
                        info.background = user.background;
                    } else {
                        return
                    } 
                })
                .then(() => {
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
            }
            db.close();
        });
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