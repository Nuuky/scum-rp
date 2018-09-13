'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');
const ObjectId = require('mongodb').ObjectID;
const Religion = require("./religion/");

module.exports = class RelCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot; 
    }

    async run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const bot = this.bot;
      
      
        if(query) {
            console.log(query)
          

            // Search for Religion -------
            Global.Fn.waitFor(Global.Fn.findData("findOne", "religion_info", {name: query.toLowerCase()}))
            .then(religion => {
                if(religion) {
                    return Religion.Search.run(msg, religion);
                }
                return Global.Msg.send(msg, "Aucune religion trouvé.", 60);
            })
          .catch(err => console.error(err))
          
          
        } else {
            Global.Fn.waitFor(Global.Fn.findData("findOne", "religion_info", {leader: msg.author.id}))
            .then(religion => {
                if(religion) Global.qHand.run(bot, msg, Religion.Questions, "religion_info", "update")
                else Global.qHand.run(bot, msg, Religion.Questions, "religion_info")
            })
            .catch(err => console.error(err))
          
          
        }
    };
}