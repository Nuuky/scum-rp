'use strict'

const fs = require("fs");
const Config = require("../json/config.json");
const grw = require("../json/grw.json");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

module.exports = {
    
    // Random number
    randomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    },

    test: (str) => {
        console.log(str);
    },
    
    // Get mode by name
    getMode: (strMode) => {
        const modes = grw.modes;
        for(var i = 0; i < modes.length; i++) {
            if(modes[i].name["en"] == strMode) {
                return modes[i];
            }
        }
    },
    
    // Shuffle array
    shuffle: (arr) => {
        for (var i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    getNick: (message, userID) => {
        return message.guild.members.get(userID).displayName;
    },

    logger: (obj) => {
        // Note: cache should not be re-used by repeated calls to JSON.stringify.
        var cache = [];
        console.log(JSON.stringify(obj, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }))
        cache = null; // Enable garbage collection
    },

    // Update file.json with Obj
    upJSON: (filePath, obj, text = filePath + '.json - Replaced!') => {
        fs.writeFile(`./json/${filePath}.json`, JSON.stringify(obj), function (err) {
            if (err) throw err;
            console.log(text);
        });
    },

    monGuilDB: (obj, action, newObj) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("rob-bot");
            if(action == "create") {
                dbo.collection("guilds").insertOne(obj, function(err, res) {
                    if (err) throw err;
                    console.log("item added to mgdb-guild");
                    db.close();
                });
            }
            if(action == "find") {
                dbo.collection("guilds").find(obj).toArray(function(err, res) {
                    if (err) throw err;
                    console.log("item found in mgdb-guild");
                    db.close();
                    return res.name;
                });
            }
            if(action == "update") {
                dbo.collection("guilds").updateOne(obj, newObj, {upsert: true}, function(err, res) {
                    if (err) throw err;
                    console.log(res.result.nModified + " document(s) updated");
                    db.close();
                });
            }
        });
    }
};