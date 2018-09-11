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


        // SEARCH USER --------
        if(query) {
            //console.log(query)
          

            // Search for Groupe -------
            const getGroupe = () => {
                const promise = new Promise((resolve, reject) => {
                    resolve(Global.Fn.findData("findOne", "user_info", {name: query.toLowerCase()}))
                })
                return promise
            }
            getGroupe()
            .then(groupe => {
                if(groupe) {
                    return Groupe.Search.run(msg, groupe);
                }
                return Global.Msg.send(msg, "Aucun groupe trouvé.", 60);
            })
          .catch(err => console.error(err))
          
          
        } else {
            const getUserGroupe = () => {
                const promise = new Promise((resolve, reject) => {
                    resolve(Global.Fn.findData("findOne", "groupe_info", {leader: msg.author.id}))
                })
                return promise
            }
            getUserGroupe()
            .then(groupe => {
                if(groupe) {
                    Global.questHandler.run(msg, Groupe.Questions, "groupe_info", "update")
               }
                else {
                    Global.questHandler.run(msg, Groupe.Questions, "groupe_info")
               }
            })
            .catch(err => console.error(err))
          
          
        }
    };
}