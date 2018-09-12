'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');


module.exports = class StatsCommand {
    constructor(msg, bot) {
      this.msg = msg;
      this.bot = bot;
    }
  
    async run(query) {
      const msg = this.msg;
      const bot = this.bot;
      
      let users, groupes, religions;
      
      Global.Fn.waitFor(Global.Fn.findData("find", "users_info", {}))
      .then(usersArr => {
          console.log(usersArr + "\n\n\n")
          users = usersArr
          
          Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
          .then(groupesArr => {
              console.log(groupesArr + "\n\n\n")
              groupes = groupesArr;
            
              Global.Fn.waitFor(Global.Fn.findData("find", "religions_info", {}))
              .then(religions => {
                console.log(religions + "\n\n\n")
      
                  const embed = {
                    "title": "Stats Bot",
                    "fields": [
                      {
                        "name": "Joueurs",
                        "value": users.length,
                        "inline": true
                      },
                      {
                        "name": "Groupes",
                        "value": groupes.length,
                        "inline": true
                      },
                      {
                        "name": "Religions",
                        "value": religions.length,
                        "inline": true
                      },
                    ]
                  }

                  Global.Msg.embed(msg, embed, 10)
                  .catch(e => console.error(e))
              })
              .catch(e => console.error(e))
          })
          .catch(e => console.error(e))
      })
      .catch(e => console.error(e))
    }
}