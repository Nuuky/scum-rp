'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');


module.exports = class StatsCommand {
    constructor(msg, bot) {
        this.msg, this.bot, this.user, this.groupes, this.religions;
        return Global.Fn.waitFor(Global.Fn.findData("find", "users_info", {}))
        .then(users => {
            console.log(users)
            this.msg = msg;
            this.bot = bot;
            Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
            .then(groupes => {
            console.log(groupes)
                this.groupes = groupes
                Global.Fn.waitFor(Global.Fn.findData("find", "religions_info", {}))
                .then(religions => {
            console.log(religions)
                    this.religions = religions
                })
            })
        })
    }
  
    async run(query) {
      const msg = this.msg;
      const bot = this.bot;
      const users = this.users;
      const groupes = this.groupes;
      const religions = this.religions;
      
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
      
      Global.Msg.embed(embed)
      .catch(e => console.error(e))
    }
}