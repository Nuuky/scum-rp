'use strict'

const fs = require("fs");
const Config = require("../json/config.json");
const grw = require("../json/grw.json");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const Message = require("./purge")

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

    monGuilDB: (obj, action, newObj, colName = "guilds") => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(process.env.DB_NAME);

            if(action == "create") {
                dbo.collection(colName).insertOne(obj, function(err, res) {
                    if (err) throw err;
                    console.log("item added");
                    db.close();
                });
            }
            if(action == "update") {
                dbo.collection(colName).updateOne(obj, newObj, {upsert: true}, function(err, res) {
                    if (err) throw err;
                    console.log(res.result.nModified + " document(s) updated");
                    db.close();
                });
            }
            if(action == "createMany") {
                dbo.collection(colName).insertMany(obj);
                console.log("items added");
            }
            if(action == "remove") {
                dbo.collection(colName).remove(obj);
                console.log("items removed");
            }
        });
    },
    
    mapDataStats: (msg) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(process.env.DB_NAME);

            dbo.collection("grw-data").find({_id:"data_stats"}).toArray(function(err, result) {
                if (err) throw err;
                console.log("item found");
                //console.log(result)
                let h = 0;
                for(let hour in result.hours) {
                    h += result.hours[hour]
                }
        
                let w = 0;
                for(let weath in result.weather) {
                    w += result.weather[weath]
                }
              
                console.log("h: + h )
        
                let hr = "";
                for(let hour in result.hours) {
                  hr += `${hour}: ${(result.hours[hour] / h) * 100}%\n`
                  console.log(hr)
                }
        
                let wr = "";
                for(let weath in result.weather) {
                  wr += `${weath}: ${(result.weather[weath] / w) * 100}%\n`
                  console.log(wr)
                }

        
                const embed = {
                  title: "Stats Heure et Temps",
                  fields: [
                    {
                      name: "Heures:",
                      value: "test",
                      inline: true
                    },
                    {
                      name: "Temps:",
                      value: "test",
                      inline: true
                    }
                  ]
                }
                Message.embed(msg, embed, 20)

                db.close();
            });

        })
    }
};