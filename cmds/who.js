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
    console.log("query: " + query)
    const msg = this.msg;
    //const Guild = this.bot.tempGuilds[msg.guild.id];
    //const prefix = Guild.prefix;
        
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db(process.env.DB_NAME);

    async function getThings(find, thing) {
      if(find == "findOne") {
        let theThing = dbo.collection("user_info").findOne(thing)
        return theThing;
      } else if(find == "find") {
        return dbo.collection("user_info").find(thing).toArray();
      }
    }

    if(query) {
        let searchObj;
        if(query.startsWith("<@")) {
          let req = args[0].replace("<@", "");
          req = req.replace(">", "");
          searchObj = {_id: req}
        } else {
          searchObj = {fullname: query}
        }
        



        let embed;

        getThings("findOne", searchObj)
        .then(result => {
  
          embed = {
            "title": "**" + result.nick + " " + result.name + "**",
            "description": `**Age:** *\`${result.age}\`*
            **Groupe:** *\`${result.groupe}\`*
            **Religion:** *\`${result.religion}\`*`,
            "color": 10579647,
            "thumbnail": {
              "url": (result.url) ? result.url : "null"
            },
            "fields": []
          }


          // USERNAME -------
          if(result.surname) {
            let surname = "";
            result.surname.forEach(sur => {
              surname += "/ " + sur + " "; 
            });
            surname = `**Surnom:** *\`${surname.slice(2, -1)}\`*\n`;
            result.surname = surname.concat(result.surname);
          }
          
          // STORY -------
          if(result.story) {
              embed.fields.push(
              {
                "name": "Description",
                "value": result.story,
                "inline": true
              }) 
          }
        })
        .catch(err => console.error(err));
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
    console.log("query: " + query)
    const msg = this.msg;
    //const Guild = this.bot.tempGuilds[msg.guild.id];
    //const prefix = Guild.prefix;
        
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db(process.env.DB_NAME);

    async function getThings(find, thing) {
      if(find == "findOne") {
        let theThing = dbo.collection("user_info").findOne(thing)
        return theThing;
      } else if(find == "find") {
        return dbo.collection("user_info").find(thing).toArray();
      }
    }

    if(query) {
        let searchObj;
        if(query.startsWith("<@")) {
          let req = args[0].replace("<@", "");
          req = req.replace(">", "");
          searchObj = {_id: req}
        } else {
          searchObj = {fullname: query}
        }
        





        let result = getThings("findOne", searchObj);
  
        let embed = {
          "title": "**" + result.nick + " " + result.name + "**",
          "description": `**Age:** *\`${result.age}\`*
          **Groupe:** *\`${result.groupe}\`*
          **Religion:** *\`${result.religion}\`*`,
          "color": 10579647,
          "thumbnail": {
            "url": (result.url) ? result.url : "null"
          },
          "fields": []
        }


        // USERNAME -------
        if(result.surname) {
          let surname = "";
          result.surname.forEach(sur => {
            surname += "/ " + sur + " "; 
          });
          surname = `**Surnom:** *\`${surname.slice(2, -1)}\`*\n`;
          result.surname = surname.concat(result.surname);
        }
        
        // STORY -------
        if(result.story) {
            embed.fields.push(
            {
              "name": "Description",
              "value": result.story,
              "inline": true
            }) 
        }



        

        // getThings("find", {"name": result.name})
        // .then(res => {
        //   console.log(res);
        //   if(res.length < 2) {
        //       Global.Msg.embed(msg, embed, 90);
        //       return db.close();
            
        //   } else {
        //       let famille = "";
        //       res.forEach(id => {
        //           if(!(id.nick == result.nick)) {
        //               famille += "- " + id.nick + " " + id.name + "\n ";
        //           }
        //       });
        //       famille = famille.slice(0, -1);
            
        //       embed.fields.push(
        //       {
        //         "name": "Famille",
        //         "value": famille,
        //         "inline": true
        //       }) 

        //       for(var type in embed) {
        //           if(type == "description") {
        //               embed[type] = embed[type].replace("0fa8mi44ll3e", "**Famille:** *" + famille + "*");
        //           }
        //       }

        //       Global.Msg.embed(msg, embed, 90);
        //   }
        // })
        // .catch(err => console.error(err));

      Global.Msg.embed(msg, embed, 90);
      db.close();
      return;

    } else {
      let authorID = msg.author.id;
      authorID = authorID.replace("<@", "")
      authorID = authorID.replace(">", "")

      console.log("Start research...");
      getThings("findOne", {_id: authorID})
      .then(authorInfo => {
        if(authorInfo) {
          console.log("Existe !")
        } else {
          console.log("N'existe pas !")
        }
      })
      .catch(err => console.error(err));

    }  

    })
  }
}
        

        getThings("find", {"name": result.name})
        .then(res => {
          console.log(res);
          if(res.length < 2) {
              Global.Msg.embed(msg, embed, 90);
              return db.close();
            
          } else {
              let famille = "";
              res.forEach(id => {
                  if(!(id.nick == result.nick)) {
                      famille += "- " + id.nick + " " + id.name + "\n ";
                  }
              });
              famille = famille.slice(0, -1);
            
              embed.fields.push(
              {
                "name": "Famille",
                "value": famille,
                "inline": true
              }) 

              for(var type in embed) {
                  if(type == "description") {
                      embed[type] = embed[type].replace("0fa8mi44ll3e", "**Famille:** *" + famille + "*");
                  }
              }

              Global.Msg.embed(msg, embed, 90);
          }
        })
        .catch(err => console.error(err));

      db.close();
      return;

    } else {
      let authorID = msg.author.id;
      authorID = authorID.replace("<@", "")
      authorID = authorID.replace(">", "")

      console.log("Start research...");
      getThings("findOne", {_id: authorID})
      .then(authorInfo => {
        if(authorInfo) {
          console.log("Existe !")
        } else {
          console.log("N'existe pas !")
        }
      })
      .catch(err => console.error(err));

    }  

    })
  }
}