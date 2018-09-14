'use strict'

const Global = require("../global/");
const Groupe = require("./groupe/");

module.exports = class GrpCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.bot = bot; 
    }

    async run(query) {
        const args = query.split(" ");
        const msg = this.msg;
        const bot = this.bot;


        // SEARCH USER --------
        if(query) {
            console.log(query)
          
            // Check for cmd
            const GrpDisp = {
                'accept': () => { return new Groupe.acceptGrp(bot, msg) },
                'reject': () => { return new Groupe.rejectGrp(bot, msg) },
                'kick': () => { return new Groupe.kickGrp(bot, msg) },
                'pending': () => { return new Groupe.pendingGrp(bot, msg) }
            };
        
            const command = GrpDisp.hasOwnProperty(args[0]) ? GrpDisp[args[0]]() : undefined
            
            Global.Fn.waitFor(Global.Fn.findData("findOne", "us"))
            if(command != undefined) return command.run(args[1]);
            

            // Search for Groupe -------
            Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {name: query.toLowerCase()}))
            .then(groupe => {
                if(groupe) {
                    return Groupe.Search.run(msg, groupe);
                }
                return Global.Msg.send(msg, "Aucun groupe trouvé.", 60);
            })
            .catch(err => console.error(err))
          
          
        } else {
            Global.Fn.waitFor(Global.Fn.findData("findOne", "groupe_info", {leader: msg.author.id}))
            .then(groupe => {
                if(groupe) {
                    Global.qHand.run(bot, msg, Groupe.Questions, "groupe_info", "update")
                }
                else {
                    Global.qHand.run(bot, msg, Groupe.Questions, "groupe_info")
                }
            })
            .catch(err => console.error(err))
        }
    };
}