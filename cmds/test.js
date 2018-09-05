'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const ObjectId = require('mongodb').ObjectID;

module.exports = class TestCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot
        console.log("Test cmd. query = " + query);
        
        Global.Fn.findData("findOne", "groupe_info", {_id: ObjectId("5b8eee97fb6fc013752b76a0")});

//         MongoClient.connect(url, (err, db) => {
//             if (err) throw err;
//             const dbo = db.db(process.env.DB_NAME);
          
//             dbo.collection("groupe_info").findOne({_id: "5b8eee97fb6fc013752b76a0"})
//             .then(religion => {
//               console.log(religion);
//             })
//         })
    }
}