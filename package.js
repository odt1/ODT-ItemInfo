"use strict";

const ItemInfo = require("./src/ItemInfo.js");

class Mod {
		constructor() {
			Logger.info("Loading: ODT-ItemInfo");
			ModLoader.onLoad["ODT-ItemInfo"] = ItemInfo.onLoadMod;
		}	
}

module.exports.Mod = new Mod();