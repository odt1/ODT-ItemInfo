"use strict"

//------------ CONFIGURATION START ---------------//

const useExtendedTradeString = true;

const userLocale = "en"; // TODO: Internationalise the mod

// const config = require("./config.json")

//------------- CONFIGURATION END ----------------//
//----------------- CODE START -------------------//
const locales = DatabaseServer.tables.locales.global
const itemTable = DatabaseServer.tables.templates.items
const fleaPrices = DatabaseServer.tables.templates.prices;
const handbookTable = DatabaseServer.tables.templates.handbook;
const quests = DatabaseServer.tables.templates.quests;
const therapist = DatabaseServer.tables.traders["54cb57776803fa99248b456e"]
const ragman = DatabaseServer.tables.traders["5ac3b934156ae10c4430e83c"]
const jaeger = DatabaseServer.tables.traders["5c0647fdd443bc2504c2d371"]
const mechanic = DatabaseServer.tables.traders["5a7c2eca46aef81a7ca2145d"]
const prapor = DatabaseServer.tables.traders["54cb50c76803fa8b248b4571"]
const peacekeeper = DatabaseServer.tables.traders["5935c25fb3acc3127c3d8cd9"]
const skier = DatabaseServer.tables.traders["58330581ace78e27b8b10cee"]
const fence = DatabaseServer.tables.traders["579dc571d53a0658a154fbec"]
const traderList = [therapist, ragman, jaeger, mechanic, prapor, peacekeeper, skier, fence]; // Trader list, sorted by best buy price. Big brain move.
const hideoutProduction = DatabaseServer.tables.hideout.production
const hideoutAreas = DatabaseServer.tables.hideout.areas

class ItemInfo {

	static AddToItemDescription(itemID, addToDescription, place)
	{	
		let originalDescription = locales[userLocale].templates[itemID].Description;
		switch (place)
		{
			case "prepend":
				locales[userLocale].templates[itemID].Description = addToDescription + originalDescription;
				break;
			case "append":
				locales[userLocale].templates[itemID].Description = originalDescription + addToDescription;
				break;
		}
	}

	static AddToItemShortName(itemID, addToShortName, place)
	{
		let originalShortName = locales[userLocale].templates[itemID].ShortName;
		switch (place)
		{
			case "prepend":
				locales[userLocale].templates[itemID].ShortName = addToShortName + originalShortName;
				break;
			case "append":
				locales[userLocale].templates[itemID].ShortName = originalShortName + addToShortName;
				break;
			case "wrap":
				locales[userLocale].templates[itemID].ShortName = addToShortName + originalShortName + addToShortName;
				break;
		}
	}

	static AddToItemName(itemID, addToName, place)
	{
		let originalName = locales[userLocale].templates[itemID].Name;
		switch (place)
		{
			case "prepend":
				locales[userLocale].templates[itemID].Name = addToName + originalName;
				break;
			case "append":
				locales[userLocale].templates[itemID].Name = originalName + addToName;
				break;
			case "wrap":
				locales[userLocale].templates[itemID].Name = addToName + originalName + addToName;
				break;
		}
	}

	static GetItemName(itemID)
	{
		return locales[userLocale].templates[itemID].Name
	}
	static GetItemShortName(itemID)
	{
		return locales[userLocale].templates[itemID].ShortName
	}
	static GetCraftingAreaName(areaID)
	{
		var stringName = "hideout_area_" + areaID + "_name"
		return locales[userLocale].interface[stringName]
	}

	static CalculateArmorLevel(itemID) // THX RaiRaiTheRaichu! 
	{
		let penetrationValue = itemTable[itemID]._props.PenetrationPower;
		return (penetrationValue >= 60) ? 6
			:	(penetrationValue >= 50) ? 5
			:	(penetrationValue >= 40) ? 4
			:	(penetrationValue >= 30) ? 3
			:	(penetrationValue >= 20) ? 2
			:	(penetrationValue >= 10) ? 1
			:	0
	}
	static GetItemPrice(itemID)
	{
		let itemBasePrice = 1;
		let parentId;
		let bestTrader;

		for(let i in handbookTable.Items)
		{
			if(handbookTable.Items[i].Id === itemID)
			{
				parentId = handbookTable.Items[i].ParentId;
				bestTrader = ItemInfo.getBestTraderMulti(parentId);
				itemBasePrice = handbookTable.Items[i].Price;
				let result = parseInt(itemBasePrice*bestTrader.multi);
				return {
				 price: result,
				 name: bestTrader.name,
				};
			} 
		}
		return itemBasePrice;
	}

	static GetFleaPrice(itemID)
	{
		if(typeof fleaPrices[itemID] != undefined) 
			{
				return fleaPrices[itemID];
			}
		return ItemInfo.GetItemPrice(itemID).price;
	}

	static getBestTraderMulti(parentId)
	{
		let traderSellCategory = "";
		let traderMulti = 0.54;
		let altTraderSellCategory = "";
		let traderName = "";

		for(let i in handbookTable.Categories)
		{
			if(handbookTable.Categories[i].Id === parentId)
			{
				traderSellCategory = handbookTable.Categories[i].Id;
				altTraderSellCategory = handbookTable.Categories[i].ParentId;
				break;
			}
		}

		for(let i = 0; i < 8; i++)
		{
			if(traderList[i].base.sell_category.includes(traderSellCategory) || traderList[i].base.sell_category.includes(altTraderSellCategory))
			{
				traderMulti = (100 - traderList[i].base.loyaltyLevels[0].buy_price_coef) / 100;
				traderName = traderList[i].base.nickname;
				return {
				 multi: traderMulti,
				 name: traderName,
				};
			}
		}
		return traderMulti;
	}

	static GetItemSlotDensity(itemID)
	{
		return itemTable[itemID]._props.Width * itemTable[itemID]._props.Height / itemTable[itemID]._props.StackMaxSize;
	}	

	static BuyableGenarator(itemID)
	{
		let barterString = "";
		for(let trader = 0; trader < 7; trader++) // iterate excluding Fence sales.
		{
			for(let barter in traderList[trader].assort.items) // iterate all seller barters 
			{
				if(traderList[trader].assort.items[barter]._tpl == itemID && traderList[trader].assort.items[barter].parentId === "hideout") // find itemid in barter 	results 
				{
					let barterID = traderList[trader].assort.items[barter]._id;
					let barterResources = traderList[trader].assort.barter_scheme[barterID][0];
					let barterLoyaltyLevel = traderList[trader].assort.loyal_level_items[barterID];
					let totalBarterPrice = 0;
					barterString += "Bought @ " + traderList[trader].base.nickname + " lv." + barterLoyaltyLevel + " > ";

					for (let barterResource = barterResources.length - 1; barterResource >= 0; barterResource--) 
					{
						let barterItem = barterResources[barterResource]._tpl
						let barterItemCount = barterResources[barterResource].count
						if (barterItem == "5449016a4bdc2d6f028b456f")
						{
							barterString += Math.round(barterItemCount) + "₽ + ";
						} 
						else if (barterItem == "569668774bdc2da2298b4568")
						{
							barterString += "€" + Math.round(barterItemCount) + " ≈ " + Math.round(ItemInfo.GetFleaPrice(barterItem)*barterItemCount) + "₽ + ";
						} 
						else if (barterItem == "5696686a4bdc2da3298b456a")
						{
							barterString += "$" + Math.round(barterItemCount) + " ≈ " + Math.round(ItemInfo.GetFleaPrice(barterItem)*barterItemCount) + "₽ + ";
						}
						else 
						{
							totalBarterPrice += ItemInfo.GetFleaPrice(barterItem)*barterItemCount; 
							barterString += ItemInfo.GetItemShortName(barterItem);
							barterString += " ×" + barterItemCount + " + "; 
						}
					}
					if (totalBarterPrice != 0) {
						totalBarterPrice = " | Σ ≈ " + Math.round(totalBarterPrice) + "₽";
					} else {
						totalBarterPrice = "";
					}
					barterString = barterString.slice(0, barterString.length - 3) + totalBarterPrice + "\n";
				}
			}
		}
		return barterString;
	}

	static UsedForTradesGenarator(itemID, addExtendedString)
	{
		let baseBarterString = "";
		for(let trader = 0; trader < 7; trader++) // iterate excluding Fence sales.
		{
			for(let barterID in traderList[trader].assort.barter_scheme) // iterate all seller barters 
			{
				for (let srcs in traderList[trader].assort.barter_scheme[barterID][0]) {
					if(traderList[trader].assort.barter_scheme[barterID][0][srcs]._tpl == itemID) 
					{
						let barterResources = traderList[trader].assort.barter_scheme[barterID][0];
						let bartedForItem;
						let totalBarterPrice = 0;

						let barterLoyaltyLevel = traderList[trader].assort.loyal_level_items[barterID];
						for(let originalBarter in traderList[trader].assort.items){
							if(traderList[trader].assort.items[originalBarter]._id == barterID) {
										bartedForItem = traderList[trader].assort.items[originalBarter]._tpl;
							}
						}
						
						baseBarterString += "Bartered ×" + traderList[trader].assort.barter_scheme[barterID][0][srcs].count;
						baseBarterString += " @ " + traderList[trader].base.nickname + " lv." + barterLoyaltyLevel + " > " + ItemInfo.GetItemName(bartedForItem);

						let extendedBarterString = " < … + ";
						for (let barterResource in barterResources) 
							{
								totalBarterPrice += ItemInfo.GetFleaPrice(barterResources[barterResource]._tpl)*barterResources[barterResource].count;
								if (barterResources[barterResource]._tpl != itemID){
									extendedBarterString += ItemInfo.GetItemShortName(barterResources[barterResource]._tpl);
									extendedBarterString += " ×" + barterResources[barterResource].count + " + ";
								}
							}
						if (totalBarterPrice != 0) {
							totalBarterPrice = " | Δ ≈ " + Math.round(ItemInfo.GetFleaPrice(bartedForItem)-totalBarterPrice) + "₽";
						} else {
							totalBarterPrice = "";
						}
						extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3);
						extendedBarterString += totalBarterPrice;
						if (addExtendedString == false) {extendedBarterString = "";}
						baseBarterString += extendedBarterString + "\n";
					}
				}
			}
		}
		// console.log(baseBarterString);
		return baseBarterString;
	}

	static CraftableGenarator(itemID)
	{
		let craftableString = "";
		for (let recipeId in hideoutProduction)
		{
			if (itemID === hideoutProduction[recipeId].endProduct && hideoutProduction[recipeId].areaType != "21") // Find every recipe for itemid and don't use Christmas Tree crafts
			{
				let recipe = hideoutProduction[recipeId];
				let componentsString = "";
				let recipeAreaString = "";
				let totalRecipePrice = 0;
				let recipeDivision = "";

				for (let i = recipe.requirements.length - 1; i >= 0; i--) // Itterate 
				{
					if (recipe.requirements[i].type === "Area" )
					{
						let recipeArea = recipe.requirements[i]; // Find and save craft area object
						recipeAreaString = ItemInfo.GetCraftingAreaName(recipeArea.areaType) + " lv." + recipeArea.requiredLevel
					}
					if (recipe.requirements[i].type === "Item")
					{
						let craftComponentId = recipe.requirements[i].templateId;
						let craftComponentCount = recipe.requirements[i].count;
						let craftComponentPrice = ItemInfo.GetFleaPrice(craftComponentId);

						componentsString += ItemInfo.GetItemShortName(craftComponentId) + " ×"  + craftComponentCount + " + ";
						totalRecipePrice += craftComponentPrice*craftComponentCount
					}
				}
				if (recipe.count > 1) {
					recipeDivision = " per item";
				}
				componentsString = componentsString.slice(0, componentsString.length - 3);
				craftableString += "Crafted " + "×" + recipe.count + " @ " + recipeAreaString + " < "
				craftableString += componentsString + " | Σ" + recipeDivision + " ≈ " + Math.round(totalRecipePrice/recipe.count) + "₽" + "\n"

				// ItemInfo.AddToItemDescription(itemID, componentsString + ", at total price per item: " + Math.round(totalRecipePrice/recipe.count) + "\n", "prepend");
				// ItemInfo.AddToItemDescription(itemID, recipe.count + " can be crafted at " + recipeAreaString + " with:", "prepend");


				// if (fleaPrice > totalRecipePrice/recipe.count) {
				// 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
				// 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + ItemInfo.GetItemName(id) + " can be crafted at " + recipeAreaString)
				// }
			}
		}
		return craftableString;
	}

	static UsedForHideoutGenerator(itemID)
	{
		let hideoutString = "";
		for (let area in hideoutAreas)
		{
			for (let s in hideoutAreas[area].stages)
			{
				for (let a in hideoutAreas[area].stages[s].requirements)
				{
					if (hideoutAreas[area].stages[s].requirements[a].templateId == itemID) {
						hideoutString += "Need ×" + hideoutAreas[area].stages[s].requirements[a].count + " > " + ItemInfo.GetCraftingAreaName(hideoutAreas[area].type) + " lv." + s + "\n";
					}
				}
			}
		}
		// console.log(hideoutString)
		return hideoutString;
	}

	static IsItemUsedForCrafting(itemID)
	{
		let usedForCraftingString = "";
		let totalCraftingPrice = 0;
		
		for (let craftID in hideoutProduction)
		{
			for (let s in hideoutProduction[craftID].requirements)
			{
				if (hideoutProduction[craftID].requirements[s].templateId == itemID) 
				{
					let usedForCraftingComponentsString = " < … + ";
					let recipeAreaString = "";
					let totalRecipePrice = 0;
					for (let i = hideoutProduction[craftID].requirements.length - 1; i >= 0; i--) // Itterate 
					{
						if (hideoutProduction[craftID].requirements[i].type == "Area" )
						{
							recipeAreaString = ItemInfo.GetCraftingAreaName(hideoutProduction[craftID].requirements[i].areaType) + " lv." + hideoutProduction[craftID].requirements[i].requiredLevel
						}
						if (hideoutProduction[craftID].requirements[i].type == "Item")
						{
							let craftComponent = hideoutProduction[craftID].requirements[i];
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString += ItemInfo.GetItemShortName(craftComponent.templateId) + " ×"  + craftComponent.count + " + ";
							}
							totalRecipePrice += ItemInfo.GetFleaPrice(craftComponent.templateId)*craftComponent.count
						}
					}
					usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3);
					usedForCraftingComponentsString += " | Δ" + " ≈ " + Math.round(ItemInfo.GetFleaPrice(hideoutProduction[craftID].endProduct)-totalRecipePrice) + "₽";
					usedForCraftingString += "Part ×" + hideoutProduction[craftID].requirements[s].count + " > " + ItemInfo.GetItemName(hideoutProduction[craftID].endProduct);
					usedForCraftingString += " @ " + recipeAreaString +usedForCraftingComponentsString+ "\n";
				}
			}
		}
		// console.log(hideoutString)
		return usedForCraftingString;
	}


	static UsedForQuestGenerator(itemID)
	{
		let questString = "";
		for (let questID in quests) 
		{
			let questConditions = quests[questID].conditions.AvailableForFinish;
			for (let i in questConditions) 
			{
				if (questConditions[i]._parent == "HandoverItem" && questConditions[i]._props.target[0] == itemID)
				{
					// console.log(questConditions[i])
					let trader = quests[questID].traderId;
					let questLevel = "";
					// for (let startConditions in quests[questID].conditions.AvailableForStart) {
					// 	// console.log()
					// 	if (quests[questID].conditions.AvailableForStart[startConditions]._parent == "Level") {
					// 		questLevel = " lv." + questConditions[startConditions]._props.value;
					// 	}
					// }
					questString += 'Found' + (function()
					{
						if (questConditions[i]._props.onlyFoundInRaid == true)
						{
							return " (✔) "
						} else {return " ";}
					})() + '×' + questConditions[i]._props.value + " > " + quests[questID].QuestName + questLevel + " @ " + DatabaseServer.tables.traders[trader].base.nickname +"\n";
				}
			}
		}
		return questString;
	}


/* WIP idea for finding weapon components
function findOriginalBarterItem(barterID){
		if (traderList[trader].assort.items[barter].parentId != hideout) {
			return findOriginalBarterItem(traderList[trader].assort.items[barter].parentId);
		} else {
			return traderList[trader].assort.items[barter]._id
		}
	}

	static IsItemUsedForCrafts(id)
	{
		return;
	}
*/
	static onLoadMod()
	{
		for (const itemID in itemTable) // Iterate all items
		{	
			if (itemTable[itemID]._type === "Item" // Check if the item is a real item and not a "node" type.
			 // && itemTable[itemID]._id == "590a3efd86f77437d351a25b" // Perfect DEBUG item - Gasan
			 && itemTable[itemID]._id != "602543c13fee350cd564d032" // ID check is for "sorting table". Believe it or not, it is coded as an item...
			 && itemTable[itemID]._props.QuestItem != true // Ignore quest items.
			 && itemTable[itemID]._parent != "5448bf274bdc2dfc2f8b456a" // Ignore secure containers.
			 && itemTable[itemID]._parent != "543be5dd4bdc2deb348b4569") // Ignore currencies.
			{
				let originalDescription = "";
				// Save original item description and catch an exception just in case something breaks.
				try 
				{
					originalDescription = locales[userLocale].templates[itemID].Description
				} 
				catch(exception)
				{
					Logger.error("Oops, ItemInfo mod here, item " + itemID + " tried to break the game by not having a proper description in locale table! Continuing like nothing happened. Sorry, not sorry.");
					continue;
				}
				let descriptionString = "";
				let priceString = "";
				let barterString = "";
				let craftingString = "";
				let usedForBarterString = "";
				let usedForQuestsString = "";
				let usedForHideoutString = "";
				let usedForCraftingString = "";

				// Calculate and store item prices
				let fleaPrice = ItemInfo.GetFleaPrice(itemID);
				let traderPrice = ItemInfo.GetItemPrice(itemID).price;
				let traderName = ItemInfo.GetItemPrice(itemID).name;



				// FEATURES START HERE:
				let itemvalue = ((traderPrice+fleaPrice)/2)/ItemInfo.GetItemSlotDensity(itemID); // Avarages traders sell price and flea price, and divides it by slot and stack sizes. This makes it so ammo is valued per stack and can be compared gains other items. Might break the desired calculation ratio if stacking mods are used.

				// FEATURE: MODIFY ITEMS BANNED ON FLEA MARKET
				if (itemTable[itemID]._props.CanSellOnRagfair === false && itemTable[itemID]._id != "56d59d3ad2720bdb418b4577")
				{
					itemTable[itemID]._props.BackgroundColor = "tracerRed";
					fleaPrice = "BANNED"
				}

				// FEATURE: ADD PRICES TO DESCRIPTION
				priceString = "Flea price: " + fleaPrice + " | " + traderName + "'s valuation: " + traderPrice + "₽\n\n";

				// FEATURE: ADD BULLET PENETRATION LEVEL TO NAME
				if (itemTable[itemID]._props.ammoType === "bullet" || itemTable[itemID]._props.ammoType === "buckshot")
				{
					ItemInfo.AddToItemShortName(itemID, " (" + ItemInfo.CalculateArmorLevel(itemID) + ")", "append");
					ItemInfo.AddToItemName(itemID, " (" + ItemInfo.CalculateArmorLevel(itemID) + ")", "append");
				}

				// FEATURE: MODIFY VALUABLE ITEMS
				if (itemTable[itemID]._parent != "5795f317245977243854e041") // Ignore containers
				{
					if (itemvalue > 15000 || fleaPrice > 50000 || traderPrice > 25000 || fleaPrice == "BANNED")
					{
						ItemInfo.AddToItemShortName(itemID, "★", "prepend");
						ItemInfo.AddToItemName(itemID, "★", "append");
					} 
					else if (itemvalue > 10000 || fleaPrice > 35000 || traderPrice > 20000) 
					{
						ItemInfo.AddToItemShortName(itemID, "☆", "prepend");
						ItemInfo.AddToItemName(itemID, "☆", "append");
					}
				}

				if (ItemInfo.BuyableGenarator(itemID).length > 1) {
					barterString = ItemInfo.BuyableGenarator(itemID) + "\n";
				}
				if (ItemInfo.CraftableGenarator(itemID).length > 1) {
					craftingString = ItemInfo.CraftableGenarator(itemID) + "\n";
				}
				if (ItemInfo.UsedForTradesGenarator(itemID, useExtendedTradeString).length > 1) {
					usedForBarterString = ItemInfo.UsedForTradesGenarator(itemID) + "\n";
				}				
				if (ItemInfo.UsedForQuestGenerator(itemID).length > 1) {
					usedForQuestsString = ItemInfo.UsedForQuestGenerator(itemID) + "\n";
					// console.log(ItemInfo.GetItemName(itemID) + " " + ItemInfo.UsedForQuestGenerator(itemID)) // List all quest items
				}
				if (ItemInfo.UsedForHideoutGenerator(itemID).length > 1) {
					usedForHideoutString = ItemInfo.UsedForHideoutGenerator(itemID) + "\n";
				}
				if (ItemInfo.IsItemUsedForCrafting(itemID).length > 1) {
					usedForCraftingString = ItemInfo.IsItemUsedForCrafting(itemID) + "\n";
				}
				descriptionString = priceString + usedForQuestsString + usedForHideoutString + barterString + craftingString + usedForCraftingString + usedForBarterString;
				ItemInfo.AddToItemDescription(itemID, descriptionString, "prepend");
				
				// console.log("--------------------\n\n"+ItemInfo.GetItemName(itemID) + "\n" + descriptionString /*+ originalDescription*/) // Debug and preview
			}
		}
		Logger.info("ItemInfo loaded. Great success!")
	}
}
module.exports = ItemInfo;