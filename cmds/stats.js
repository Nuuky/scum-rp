'use strict'

const Json = require('../json/');
const Global = require("../global/");
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;
const fetch = require('node-fetch');


module.export = class StatsCommand {
    constructor(msg, bot) {
        Global.Fn.waitFor(Global.Fn.findData("find", "groupe_info", {}))
    }
}