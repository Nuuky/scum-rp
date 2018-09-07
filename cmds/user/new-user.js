'use strict'

const Json = require('../../json/');
const Global = require("../../global/");
const ObjectId = require('mongodb').ObjectID;

module.exports = class NewUserCommand {

    static run(msg) {
      
        Global.Msg.reply(msg, "f", 300)
      
    };
}



/* 
    user: {
        "_id": "DiscordID",

        "name": "Nuri Kavasky",

        "age": 32,

        "style": {
            "sex": 1,
            "head": 1,
            "tatoo": 1,
        },

        "crimes": ["Vole", "Meurtre"],

        "job": "Chasseur / Paysan / Eleveur / Prêtre / ...", (opt)

        "hostility": "Amicale / Méfiant / Dangereux", (opt)

        "groupe": "$groupeID", (opt)

        "religion": "$religionID", (opt)

        "image": "https://i.gyazo.com/0023bb1e3275bccbd93c3727607c6152.png", (opt)

        "background": "Background du personnage" (opt)
    }
*/