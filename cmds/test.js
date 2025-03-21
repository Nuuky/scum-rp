'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const ObjectId = require('mongodb').ObjectID;
const base64Img = require('base64-img');
const Canvas = require('canvas');
const fs = require('fs');

module.exports = class TestCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
        this.randomNb = Global.Fn.randomNumber(999, 99999999)
    }

    async run(query) {
        const args = query.split(" ");
        const msg = this.msg
        const bot = this.bot;
        const randomNb = this.randomNb;
      
      let arr = [
        {
          $match: {
            _id: ObjectId("5b9cbd53e0e3a0093bffc508")
          }
        },
        {
          $lookup: {
            from: "user_info",
            localField: "members.id",
            foreignField: "_id",
            as: "membersList"
          }
        },
        {
          $group: {
            members: {$mergeObjects: [{"$member": 1}, {"$membersList": 1}]}           
          }
        }
      ]
      let i = 0;
      MongoClient.connect(url).then((db) => {
          const dbo = db.db(process.env.DB_NAME);
        
          dbo.collection("groupe_info").aggregate(arr).toArray((err, res) => {
              if(err) throw err;
              console.log(res[0])
              // res.forEach(r => {
              //   console.log(r)
              // })
          })
          
        
          db.close()
      })
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
//       const Image = Canvas.Image,
//           canvas = Canvas.createCanvas(400, 300),
//           ctx = canvas.getContext('2d');

//       ctx.font = '30px Impact';
//       ctx.rotate(.1);
//       ctx.fillText(query, 50, 100);

//       var te = ctx.measureText(query);
//       ctx.strokeStyle = 'rgba(0,0,0,0.5)';
//       ctx.beginPath();
//       ctx.lineTo(50, 102);
//       ctx.lineTo(50 + te.width, 102);
//       ctx.stroke();
//       const filePathCust = "./images/" + randomNb + ".png"
//       console.log(filePathCust)
      
//       base64Img.img(canvas.toDataURL(), './images/', randomNb, function(err, filepath) {
//           if(err) return console.error(err);
        
//             msg.channel.send({files: [filePathCust]});
        
        
//            fs.stat(filePathCust, function (err, stats) {
//                // console.log(stats);//here we got all information of file in stats variable

//                if (err) {
//                    return console.error(err);
//                }

//                fs.unlink(filePathCust,function(err){
//                     if(err) return console.log(err);
//                     console.log('file deleted successfully');
//                });  
//           });
//       });
      }
}