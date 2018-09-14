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
        //console.log(query)


        // SEARCH USER --------
        if(query) {
            // If not an admin
            if(!msg.author.id.match(process.env.ADMIN_ID)) return Global.Msg.Send(msg, "Seul les admins peuvent s'occuper des villes.");
            // Case we want to remove city
            if(args[0].toLowerCase() == "rm") { //!ville remove [name]
                // If no city
                if(!args[1]) return Global.Msg.Send(msg, "Veuillez indiquer les ville à libérer.");
              
                Global.Fn.waitFor(Global.Fn.findData("findOne", "city_info", {name: args[1].toLowerCase()}))
                .then(city => {
                    // City doesn't exist
                    if(!city) return Global.Msg.Send(msg, "Aucune ville ne correspond au nom donné.");
                    // City already free
                    if(city.free) return Global.Msg.Send(msg, "La ville n'est actuellement sous le contrôle d'aucun groupe.");
                    
                    Global.mongUpdate({city: ObjectId(city._id)}, "update", "groupe_info", {$set: {city: false}});
                    Global.mogUpdate({name: args[1].toLowerCase()}, "update", "city_info", {$set: {free: true}});
                    // All done
                    return Global.Msg.Send(msg, "Ville libéré.");
                })
            }

             // GET USER GRP -------
            Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {leader: msg.author.id}))
            .then(groupe => {
                if(groupe) {
                }
                return Global.Msg.send(msg, "Vous n'êtes pas leader d'un groupe.", 60);
            })
          .catch(err => console.error(err))
          
          
        } else {
          
            Global.Fn.waitFor(Global.Fn.findData("find", "city_info", {free: true}))
            .then(cities => {
                let citiesList = ""
                cities.forEach((city, index) => {
                    citiesList += city.name + " (" + city.cell[0] + city.cell[1] + ")\n"
                })
                const embed = {
                    title: "Viles disponibles",
                    description: "Seul les admins peuvent donner des villes.",
                    fields: [
                        {
                            name: "Villes",
                            value: citiesList
                        }
                    ]
                }
                
                Global.Msg.embed(msg, embed, 120)
            })
          
        }
    };
}