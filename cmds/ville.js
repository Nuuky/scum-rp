'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');
const ObjectId = require('mongodb').ObjectID;

module.exports = class VilleCommand {

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
            //console.log(query)
          

             // GET USER GRP -------
            Global.waitFor(Global.Fn.findData("findOne", "groupe_info", {leader: msg.author.id}))
            .then(groupe => {
                if(groupe) {
                    
                }
                return Global.Msg.send(msg, "Vous n'êtes pas leader d'un groupe.", 60);
            })
          .catch(err => console.error(err))
          
          
        } else {
          
            Global.waitFor(Global.findData("find", "city_info", {free: true}))
            .then(cities => {
                
            })
          
        }
    };
}