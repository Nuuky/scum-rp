'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');
const ObjectId = require('mongodb').ObjectID;
const User = require("./user/");

module.exports = class WhoCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot; 
    }

    async run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const rpData = this.bot.tempScum;


        // SEARCH USER --------
        if(query) {
            //console.log(query)
          

             // GET USER -------
            // Research ID
            let searchObj;
            if(query.startsWith("<@")) {
                let req = args[0].replace("<@", "");
                req = req.replace(">", "");
                searchObj = {_id: req}
            } else {
                searchObj = {name: query}
            }
            //console.log(searchObj)

            // Search for User
            const getUser = () => {
                const promise = new Promise((resolve, reject) => {
                    resolve(Global.Fn.findData("findOne", "user_info", searchObj))
                })
                return promise
            }
            getUser()
            .then(user => {
                if(user) {
                    return User.SearchUser.run(msg, user);
                }
                return Global.Msg.send(msg, "Aucun joueur trouvé.", 60);
            })
          .catch(err => console.error(err))
          
          
        } else {
          
          
            let authorID = msg.author.id;
            authorID = authorID.replace("<", "");
            authorID = authorID.replace(">", "");
          
            const getUser = () => {
                const promise = new Promise((resolve, reject) => {
                    resolve(Global.Fn.findData("findOne", "user_info", {_id: authorID}))
                })
                return promise
            }
            getUser()
            .then(user => {
                if(user) {
                    Global.questHandler.run(msg, User.NewUser, "user_info", "update")
               }
                else {
                    Global.questHandler.run(msg, User.NewUser, "user_info")
               }
            })
            .catch(err => console.error(err))
          
          
        }
    };
}