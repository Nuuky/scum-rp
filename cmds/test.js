'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

module.exports = class TestCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot
        console.log("Test cmd. query = " + query);
        
        

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            const dbo = db.db(process.env.DB_NAME);
          
            dbo.collection("religion_info").findOne({name: "Caprane"})
            .then(religion => {
              console.log(religion);
            })
        })
    }
}