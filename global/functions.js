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
  
  
    findData: (findType, colName, findObj) => {
        return MongoClient.connect(url).then((db) => {
            const dbo = db.db(process.env.DB_NAME);

            if(findType == "find") {
                return dbo.collection(colName).find(findObj).toArray();
            }
            if(findType == "findOne") {
                return dbo.collection(colName).findOne(findObj);
            }
        })
    }
};