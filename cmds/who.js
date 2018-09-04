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

    async run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const rpData = this.bot.tempScum;

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            const dbo = db.db(process.env.DB_NAME);

            // SEARCH USER --------
            if(query) {

                // ASYNC FN TO MAKE THE USER INFO LIST (because of async MONGDB)
                async function makeList() {
                    let list = {};
                    let desc = "";

                    // Research ID
                    let searchObj;
                    if(query.startsWith("<@")) {
                        let req = args[0].replace("<@", "");
                        req = req.replace(">", "");
                        searchObj = {_id: req}
                    } else {
                        searchObj = {fullname: query}
                    }
                    
                    // Get User
                    const userInfo = dbo.collection("user_info").findOne(searchObj);
    
                    // Get religion name
                    if(userInfo.religion) {
                        const religion = dbo.collection("religion_info").findOne({_id: userInfo.religion});
                        const religionDesc = religion.name + ((religion.leader == userInfo._id) ? " 🌟\n" : "\n")
                        religionDesc.concat(desc);
                    }
    
                    // Get groupe name
                    if(userInfo.groupe) {
                        const groupe = dbo.collection("groupe_info").findOne({_id: userInfo.groupe});
                        const groupeDesc = groupe.name + ((groupe.leader == userInfo._id) ? " 👑\n" : "\n");
                        groupeDesc.concat(desc);
                    }

                    // Get Background Story
                    if(userInfo.background) {
                        list.background = userInfo.background;
                    }
                    
                    // Common Infos
                    (userInfo.age + "\n").concat(desc);

                    list.title = "'" + userInfo.name + "'";
                    list.desc = desc;
                    list.color = 10579647;
                    list.image = (userInfo.url) ? userInfo.url : "null";

                    return list;
                }
                makeList()
                .then(list => {
                    const embed = {
                        "title": list.title,
                        "description": list.desc,
                        "color": list.color
                    }

                    if(list.background) {
                        embed["fields"] = [
                            {
                                "name": "Background",
                                "value" : list.background,
                            }
                        ];
                    }

                    Global.Msg.embed(msg, embed, 90);
                })
                .catch(err => console.error(err))
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