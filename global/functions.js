'use strict'

const fs = require("fs");
const Config = require("../json/config.json");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const Message = require("./purge")
const strTo = require("./strTo.js")

module.exports = {
    
    // Random number
    randomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    },

    test: (str) => {
        console.log(str);
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

    mongUpdate: (obj, action, colName = "user_info", newObj) => {
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
                    // console.log(res.result.nModified + " document(s) updated");
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
  
    waitFor: (action) => {
        const promise = new Promise((resolve, reject) => {
            resolve(action)
        })
        return promise
    },
  
  
    findData: (findType, colName, findObj) => {
        return MongoClient.connect(url).then((db) => {
            const dbo = db.db(process.env.DB_NAME);

            if(findType == "find") {
                return dbo.collection(colName).find(findObj).toArray()
            }
            if(findType == "findOne") {
                return dbo.collection(colName).findOne(findObj)
            }
            if(findType == "agre") {
                ([
                     {
                         $lookup: {
                         from: "inventory",
                         localField: "item",
                         foreignField: "sku",
                          as: "inventory_docs"
                          }
                      }
                  ])
            }
        })
    },
  
    hostilityColor: (value) => {
      
        switch(value) {
            case "Amicale":
                return 432896;
                break;
            case "Méfiant":
                return 31487;
                break;
            case "Hostile":
                return 14680064;
                break;
            default:
                console.error("This hostility type doesn't exist !")
        }
    },
  
    capitalize: (string) => {
        let capitalizing = string.split(" ");
        let newStr = "";
        capitalizing.forEach((word, index) => {
            newStr += word.replace(/\b\w/g, l => l.toUpperCase()) + " "
        })
        return newStr;
    },
  
    toTime: (time, inc) => {
        const max = 24
        let timeInc = time + inc
        if(timeInc < max && timeInc >= 10) return timeInc
        if(timeInc == 24) return "00"
        let timeToMax = timeInc - max
        if(timeToMax < 10) timeToMax = "0" + timeToMax
        return timeToMax
    }
};