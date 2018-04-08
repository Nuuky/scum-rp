'use strict'

const Config = require("../json/config.json");

module.exports = {
    color: (str) => {
        const colors = {
          "blue": () => {return 255},
          "red": () => {return 16711680},
          "green": () => {return 261888},
          "orange": () => {return 16743680},
          "white": () => {return 16777215},
          "black": () => {return 1},
          "pink": () => {return 16711929},
          "purple": () => {return 7799039},
          "cyan": () => {return 65499},
          "magenta": () => {return 16711778},
          "forest": () => {return 25616}
        }
        if(colors.hasOwnProperty(str)) {
          colors[str]();
        }
    }
}; 