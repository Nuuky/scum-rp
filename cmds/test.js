'use strict'

const Global = require('../global/')
const Json = require("../json/")
const say = require('say')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const ObjectId = require('mongodb').ObjectID;

module.exports = class TestCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot;
    }

    async run(query) {
        const msg = this.msg
        const { createCanvas, loadImage } = require('canvas')
        const canvas = createCanvas(200, 200)
        const ctx = canvas.getContext('2d')

        // below is optional
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(100, 100, 200, 200);
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(150, 150, 200, 200);
        ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        ctx.fillRect(200, 50, 200, 200);
      
        let embed = {
          image: {url: canvas.toDataURL('image/jpeg', 1.0)}
        }
        console.log(canvas.toDataURL('image/jpeg', 1.0))
        msg.author.send({embed});
      
    }
}