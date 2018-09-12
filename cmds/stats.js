'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');


module.exports = class StatsCommand {
    constructor(bot, msg) {
      this.msg = msg;
      this.bot = bot;
    }
  
    async run(query) {
      const msg = this.msg;
      const bot = this.bot;
      
      let users, groupes;
      
      Global.Fn.waitFor(Global.Fn.findData("find", "users_info", {}))
      .then(usersArr => {
          console.log(usersArr + "\n")
          users = usersArr
          return Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
      }) 
      .then(groupesArr => {
          console.log(groupesArr + "\n")
          groupes = groupesArr;
          return Global.Fn.waitFor(Global.Fn.findData("find", "religions_info", {}))
      })
      .then(religions => {
          console.log(religions)

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

          Global.Msg.send(msg, embed)
          .catch(e => console.error(e))
      })
      .catch(e => console.error(e))
    }
}