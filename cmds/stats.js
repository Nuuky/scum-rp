'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');


module.export = class StatsCommand {
    constructor(msg, bot) {
        this.msg = msg;
        this.bot = bot;
        this.users = Global.Fn.findData("find", "users_info", {})
        this.groupes = Global.Fn.findData("find", "groupe_info", {})
        this.religions = Global.Fn.findData("find", "religions_info", {})
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
    }
}