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
            let info;

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
            
            console.log("Searching user..");
            
            const user = Global.Fn.findData("findOne", "user_info", searchObj);

            // Get religion name
            if(user.religion) {
                console.log("Searching Religion.");
                const religion = Global.Fn.findData("findOne", "religion_info", {_id: user.religion});
            }


            // Get groupe name
            if(user.groupe) {
                console.log("Searching Groupe");
                const groupe = Global.Fn.findData("findOne", "groupe_info", {_id: user.groupe});
            }

            Promise.all([user, religion, groupe]).then(() => {

                info.desc = religion.name + ((religion.leader == user._id) ? " 🌟\n" : "\n");
            
                let groupeStr = groupe.name + ((groupe.leader == user._id) ? " 👑\n" : "\n");
                info.desc = groupeStr.concat(info.desc);
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





  
findData: (findType, colName, findObj) => {
    return MongoClient.connect.then((db) => {
        const dbo = db.db(process.env.DB_NAME);
        
        if(findType == "find") {
            return dbo.collection(colName).find(findObj).toArray();
        }
        if(findType == "findOne") {
            return dbo.collection(colName).findOne(findObj);
        }
    })
}
    
    
    
    (url, (err, db) => {
        if (err) throw err;
        const dbo = db.db(process.env.DB_NAME);
        
        if(findType == "find") {
            return dbo.collection(colName).find(findObj).toArray();
        }
        if(findType == "findOne") {
            return dbo.collection(colName).findOne(findObj);
        }
    });




// db1.js
var MongoClient = require('mongodb').MongoClient;
                       
module.exports = {
  FindinCol1: function() {
    return MongoClient.connect('mongodb://localhost:27017/db1').then(function(db) {
      var collection = db.collection('col1');
      
      return collection.find().toArray();
    }).then(function(items) {
      console.log(items);
      return items;
    });
  }
};


// app.js
var db = require('./db1');
    
db.FindinCol1().then(function(items) {
  console.info('The promise was fulfilled with items!', items);
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});