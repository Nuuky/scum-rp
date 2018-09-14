'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const ObjectId = require('mongodb').ObjectID;
const base64Img = require('base64-img');
const Canvas = require('canvas')

module.exports = class TestCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const bot = this.bot;
      
        // Json.cities.forEach(city => {
        //     Global.Fn.mongUpdate(city, "create", "city_info")
        // })
      
//       const Image = Canvas.Image,
//           canvas = Canvas.createCanvas(200, 200),
//           ctx = canvas.getContext('2d');

//       ctx.font = '30px Impact';
//       ctx.rotate(.1);
//       ctx.fillText("Awesome!", 50, 100);

//       var te = ctx.measureText('Awesome!');
//       ctx.strokeStyle = 'rgba(0,0,0,0.5)';
//       ctx.beginPath();
//       ctx.lineTo(50, 102);
//       ctx.lineTo(50 + te.width, 102);
//       ctx.stroke();
//       console.log(canvas.toDataURL())
//       base64Img.img(canvas.toDataURL(), './images/', '1', function(err, filepath) {
//           if(err) return console.error(err);
//           console.log(filepath)
//           msg.channel.send(filepath)
//       });
        msg.channel.send(../images/1.png)
      
      }
}