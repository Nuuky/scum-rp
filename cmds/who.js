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
                
                Global.Fn.findData("findOne", "user_info", searchObj).then(function(items) {
                  console.info('The promise was fulfilled with items!');
                  return items
                }, function(err) {
                  console.error('The promise was rejected', err, err.stack);
                });
            }
            makeList()
            .then(userInfo => {
                console.log(userInfo)
                user = userInfo;

                // Get religion name
                if(userInfo.religion) {
                    console.log("Searching Religion.");
                
                    Global.Fn.findData("findOne", "religion_info", {_id: userInfo.religion}).then(function(items) {
                      console.info('The promise was fulfilled with items!');
                      return items
                    }, function(err) {
                      console.error('The promise was rejected', err, err.stack);
                    });
                } else {
                    return
                } 
            })
//             .then(religion => {
//                 info.desc = religion.name + ((religion.leader == user._id) ? " 🌟\n" : "\n");

//                 // Get groupe name
//                 if(user.groupe) {
//                     console.log("Searching Groupe");
//                     return Global.Fn.findData("findOne", "groupe_info", {_id: user.groupe});
//                 } else {
//                     return
//                 } 
//             })
//             .then(groupe => {
//                 let groupeStr = groupe.name + ((groupe.leader == user._id) ? " 👑\n" : "\n");
//                 info.desc = groupeStr.concat(info.desc);
//                 (user.age + "\n").concat(info.desc);

//                 // Get Background Story
//                 if(user.background) {
//                     console.log("Get Background.");
//                     info.background = user.background;
//                 } else {
//                     return
//                 } 
//             })
//             .then(() => {
//                 console.log("Startin Embed...");
                
//                 // Common Infos
//                 info.title = "'" + user.name + "'";
//                 info.color = 10579647;
//                 info.image = (user.image) ? user.image : "null";

//                 const embed = {
//                     "title":  "**" + user.name + "**",
//                     "description": info.desc,
//                     "color": info.color,
//                     "thumbnail": {
//                         "url": (user.image) ? user.image : "null"
//                     }
//                 }

//                 if(info.background) {
//                     embed["fields"] = [
//                         {
//                             "name": "Background",
//                             "value" : info.background,
//                         }
//                     ];
//                 }

//                 Global.Msg.embed(msg, embed, 90);
//             })
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