'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');
const ObjectId = require('mongodb').ObjectID;
const Groupe = require("./groupe/");

module.exports = class GrpCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot; 
    }

    async run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const bot = this.bot;


        // SEARCH USER --------
        if(query) {
            console.log(query)
          
            if(args[0].match("add|rm")) return
          

            // Search for Groupe -------
            Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {name: query.toLowerCase()}))
            .then(groupe => {
                if(groupe) {
                    return Groupe.Search.run(msg, groupe);
                }
                return Global.Msg.send(msg, "Aucun groupe trouvé.", 60);
            })
          .catch(err => console.error(err))
          
          
        } else {
            Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {leader: msg.author.id}))
            .then(groupe => {
                if(groupe) {
                    Global.qHand.run(bot, msg, Groupe.Questions, "groupe_info", "update")
               }
                else {
                    Global.qHand.run(bot, msg, Groupe.Questions, "groupe_info")
               }
            })
            .catch(err => console.error(err))
          
          
        }
    };
}