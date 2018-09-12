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
      
      Global.Fn.waitFor(Global.Fn.findData("find", "user_info", {}))
      .then(usersArr => {
          users = usersArr
          return Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
      }) 
      .then(groupesArr => {
          groupes = groupesArr;
          return Global.Fn.waitFor(Global.Fn.findData("find", "religion_info", {}))
      })
      .then(religions => {
          console.log("Users = " + users + "\n")
          console.log("Groupes = " + groupes + "\n")
          console.log("Religions = " + religions)

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

          Global.Msg.embed(msg, embed, 20)
      })
      .catch(e => console.error(e))
    }
}