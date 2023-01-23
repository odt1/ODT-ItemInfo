"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let database;
let tables;
let items;
let handbook;
let logger;
let locales;
let localesKeys;
let clientItems;
let fleaPrices;
let hideoutProduction;
let hideoutAreas;
let quests;
let armors;
let therapist;
let ragman;
let jaeger;
let mechanic;
let prapor;
let peacekeeper;
let skier;
let fence;
let traderList;
class ItemInfo {
    init(container) {
        logger = container.resolve("WinstonLogger");
        database = container.resolve("DatabaseServer");
        tables = database.getTables();
        items = tables.templates.items;
        handbook = tables.templates.handbook;
        locales = tables.locales.global;
        localesKeys = Object.keys(tables.locales.global);
        clientItems = tables.templates.clientItems;
        fleaPrices = tables.templates.prices;
        hideoutProduction = tables.hideout.production;
        hideoutAreas = tables.hideout.areas;
        quests = tables.templates.quests;
        armors = tables.globals.config.ArmorMaterials;
        therapist = tables.traders["54cb57776803fa99248b456e"];
        ragman = tables.traders["5ac3b934156ae10c4430e83c"];
        jaeger = tables.traders["5c0647fdd443bc2504c2d371"];
        mechanic = tables.traders["5a7c2eca46aef81a7ca2145d"];
        prapor = tables.traders["54cb50c76803fa8b248b4571"];
        peacekeeper = tables.traders["5935c25fb3acc3127c3d8cd9"];
        skier = tables.traders["58330581ace78e27b8b10cee"];
        fence = tables.traders["579dc571d53a0658a154fbec"];
        traderList = [therapist, ragman, jaeger, mechanic, prapor, peacekeeper, skier, fence];
    }
    postDBLoad(container) {
        this.init(container);
        // log(handbook.Categories)
        // log(items[`5c0530ee86f774697952d952`])
        // log(hideoutProduction)
        // log(this.getItemName('5c0530ee86f774697952d952'))
        // log(this.getItemBestPrice('5c0530ee86f774697952d952'))
        for (const itemID in items) {
            let item = items[itemID];
            let itemInHandbook = this.getItemInHandbook(itemID);
            if (item._type === "Item" // Check if the item is a real item and not a "node" type.
                && itemInHandbook != undefined // Ignore "useless" items
                && item._props.QuestItem != true // Ignore quest items.
                && item._parent != "543be5dd4bdc2deb348b4569" // Ignore currencies.
            ) {
                let descriptionString = "";
                let priceString = "";
                let barterString = "";
                let craftingString = "";
                let usedForBarterString = "";
                let usedForQuestsString = "";
                let usedForHideoutString = "";
                let usedForCraftingString = "";
                let armorDurabilityString = "";
                let spawnChanceString = "";
                let tier = "";
                let itemRarity = [];
                // Calculate and store item prices
                let fleaPrice = this.getFleaPrice(itemID);
                let traderPrice = this.getItemBestPrice(itemID).price;
                let traderName = this.getItemBestPrice(itemID).name;
                let BuyableGenarator = this.buyableGenarator(itemID);
                let UsedForTradesGenarator = this.usedForTradesGenarator(itemID);
                // FEATURES START HERE:
                // FEATURE: ADD BULLET PENETRATION LEVEL TO NAME
                if (item._props.ammoType === "bullet" || item._props.ammoType === "buckshot") {
                    this.addToShortName(itemID, ` (${this.calculateArmorLevel(itemID)})`, "append");
                    this.addToName(itemID, ` (${item._props.Damage}/${item._props.PenetrationPower})`, "append");
                }
                // FEATURE: RARITY RECOLOR
                item._props.BackgroundColor = "grey";
                // FEATURE: MODIFY ITEMS BANNED ON FLEA MARKET
                itemRarity = [BuyableGenarator.rarity[0]];
                if (item._props.CanSellOnRagfair === false && item._id != "56d59d3ad2720bdb418b4577" && !itemRarity[0] > 0) {
                    fleaPrice = "BANNED";
                    itemRarity[0] = 9;
                }
                if (typeof itemRarity[0] == undefined) {
                    itemRarity[0] = clientItems._props.Rarity;
                }
                if (item._parent == "543be5cb4bdc2deb348b4568") // Ammo boxes special case
                 {
                    let count = item._props.StackSlots[0]._max_count;
                    let ammo = item._props.StackSlots[0]._props.filters[0].Filter[0];
                    let value = this.getItemBestPrice(ammo).price;
                    traderPrice = value * count;
                    if (typeof itemRarity[0] == undefined) {
                        itemRarity = [this.buyableGenarator(ammo).rarity[0]];
                    }
                }
                if (fleaPrice * 0.8 < traderPrice) // Stop flea abuse
                 {
                    // console.log(`--------------------\n${this.getItemName(itemID)}\n${traderPrice-fleaPrice*0.8}`)
                    let fleaPriceFix = Math.round(traderPrice * (1 / 0.8 + 0.01));
                    fleaPrices[itemID] = fleaPriceFix;
                    fleaPrice = fleaPriceFix;
                }
                if (itemRarity.includes(9)) {
                    tier = "OVERPOWERED";
                    item._props.BackgroundColor = "tracerRed";
                }
                if (itemRarity.includes(1) || itemRarity.includes("Common")) {
                    tier = "COMMON";
                    item._props.BackgroundColor = "default";
                }
                else if (itemRarity.includes(2) || itemRarity.includes("Rare")) {
                    tier = "RARE";
                    item._props.BackgroundColor = "blue";
                }
                else if (itemRarity.includes(3) || itemRarity.includes("Superrare")) {
                    tier = "EPIC";
                    item._props.BackgroundColor = "violet";
                }
                else if (itemRarity.includes(4) || itemRarity.includes("Not_exist")) {
                    tier = "LEGENDARY";
                    item._props.BackgroundColor = "yellow";
                }
                else if (itemRarity.includes(5)) {
                    tier = "RARE";
                    item._props.BackgroundColor = "blue";
                }
                else if (itemRarity.includes(6)) {
                    tier = "EPIC";
                    item._props.BackgroundColor = "violet";
                }
                else if (itemRarity.includes(7)) {
                    tier = "LEGENDARY";
                    item._props.BackgroundColor = "Yellow";
                }
                else if (itemRarity.includes(8)) {
                    tier = "UBER";
                    item._props.BackgroundColor = "tracerYellow";
                }
                // this.AddToItemShortName(itemID, "", "prepend");
                if (tier.length > 0) {
                    // this.AddToItemName(itemID, " | " + tier, "append");
                    // this.AddToItemShortName(itemID, `(${aamoDesc[0].slice(0, 1)})`, "append");
                    priceString += tier + " | ";
                }
                // let spawn = clientItems._props?.SpawnChance; // GOOOOOOD
                // if (spawn > 0)
                // {
                //     priceString += `Spawn chance: ${spawn}%\n`;
                //     // this.AddToItemName(itemID, ` ${spawn}% Value: ${Math.round(rarityValue)}`, "append");
                // }
                if (BuyableGenarator.trades.length > 0) {
                    // console.log(this.GetItemName(itemID) + ": " + BuyableGenarator.trades.join(", "));
                    this.addToName(itemID, " | " + BuyableGenarator.trades.join(", "), "append");
                }
                if (item._props.armorClass > 0) {
                    let armor = armors[item._props.ArmorMaterial];
                    armorDurabilityString += `Effective durability: ${Math.round(item._props.MaxDurability / armor.Destructibility)} | Repairability: ${100 - armor.MaxRepairDegradation * 100}%-${100 - armor.MinRepairDegradation * 100}%\n`;
                    // console.log(`---\n${this.GetItemName(itemID)}\n${armorDurabilityString}`);
                }
                // FEATURE: ADD PRICES TO DESCRIPTION
                let itemvalue = ((traderPrice + fleaPrice) / 2) / this.getItemSlotDensity(itemID); // Avarages traders sell price and flea price, and divides it by slot and stack sizes. This makes it so ammo is valued per stack and can be compared gains other items. Might break the desired calculation ratio if stacking mods are used.
                priceString += `Flea price: ${fleaPrice} | ${traderName}'s valuation: ${traderPrice}₽\n\n`;
                // FEATURE: MODIFY VALUABLE ITEMS
                // if (itemTable[itemID]._parent != "5795f317245977243854e041") // Ignore containers
                // {
                // 	if (itemvalue > 15000 || fleaPrice > 50000 || traderPrice > 25000 || fleaPrice == "BANNED")
                // 	{
                // 		this.AddToItemShortName(itemID, "★", "prepend");
                // 		this.AddToItemName(itemID, "★", "append");
                // 	} 
                // 	else if (itemvalue > 10000 || fleaPrice > 35000 || traderPrice > 20000) 
                // 	{
                // 		this.AddToItemShortName(itemID, "☆", "prepend");
                // 		this.AddToItemName(itemID, "☆", "append");
                // 	}
                // }
                for (const locale in localesKeys) {
                    BuyableGenarator.string[locale];
                }
                if (BuyableGenarator.string.length > 1) {
                    barterString = BuyableGenarator.string + "\n";
                }
                if (this.craftableGenarator(itemID).length > 1) {
                    craftingString = this.craftableGenarator(itemID) + "\n";
                }
                if (UsedForTradesGenarator.string.length > 1) {
                    usedForBarterString = UsedForTradesGenarator.string + "\n";
                }
                if (this.usedForQuestGenerator(itemID).length > 1) {
                    usedForQuestsString = this.usedForQuestGenerator(itemID) + "\n";
                    // item._props.BackgroundColor = "tracerGreen"
                    this.addToName(itemID, "★", "append");
                    this.addToShortName(itemID, "★", "prepend");
                    // console.log(this.GetItemName(itemID) + " " + this.UsedForQuestGenerator(itemID)) // List all quest items
                }
                if (this.usedForHideoutGenerator(itemID).length > 1) {
                    usedForHideoutString = this.usedForHideoutGenerator(itemID) + "\n";
                }
                if (this.isItemUsedForCrafting(itemID).length > 1) {
                    usedForCraftingString = this.isItemUsedForCrafting(itemID) + "\n";
                }
                descriptionString = priceString + spawnChanceString + armorDurabilityString + usedForQuestsString + usedForHideoutString + barterString + craftingString + usedForCraftingString + usedForBarterString;
                this.addToDescription(itemID, descriptionString, "prepend");
                // if (item._parent == "543be5cb4bdc2deb348b4568") // Ammo boxes special case
                // {
                // 	console.log(`--------------------\n\n${this.GetItemName(itemID)}\n${locales[userLocale].templates[itemID].ShortName}\n${descriptionString}`)
                // }
                // console.log(`---\n${this.GetItemName(itemID)}\n${descriptionString}`);
                // getBaseCategory(itemClient._parent)
                // console.log(`---\n${itemID}`)
                // console.log(itemClient._id)
                // console.log("---\n" + itemID)
                // if (spawnDict[getBaseCategory(itemClient._parent)])
                // {
                // 	spawnDict[getBaseCategory(itemClient._parent)].value += itemClient._props.SpawnChance;
                // 	spawnDict[getBaseCategory(itemClient._parent)].count += 1;
                // } else
                // {
                // 	spawnDict[getBaseCategory(itemClient._parent)] = {};
                // 	spawnDict[getBaseCategory(itemClient._parent)].value = itemClient._props.SpawnChance;
                // 	spawnDict[getBaseCategory(itemClient._parent)].count = 1;
                // }
            }
        }
    }
    getItemName(itemID, locale = 'en') {
        return locales[locale][`${itemID} Name`];
    }
    getItemShortName(itemID, locale = 'en') {
        return locales[locale][`${itemID} ShortName`];
    }
    getItemDescription(itemID, locale = 'en') {
        return locales[locale][`${itemID} Name`];
    }
    addToName(itemID, addToName, place, locale = 'en') {
        let originalName = locales[locale][`${itemID} Name`];
        switch (place) {
            case "prepend":
                locales[locale][`${itemID} Name`] = addToName + originalName;
                break;
            case "append":
                locales[locale][`${itemID} Name`] = originalName + addToName;
                break;
        }
    }
    addToShortName(itemID, addToShortName, place, locale = 'en') {
        let originalShortName = locales[locale][`${itemID} Name`];
        switch (place) {
            case "prepend":
                locales[locale][`${itemID} Short Name`] = addToShortName + originalShortName;
                break;
            case "append":
                locales[locale][`${itemID} Short Name`] = originalShortName + addToShortName;
                break;
        }
    }
    addToDescription(itemID, addToDescription, place, locale = 'en') {
        let originalDescription = locales[locale][`${itemID} Name`];
        switch (place) {
            case "prepend":
                locales[locale][`${itemID} Description`] = addToDescription + originalDescription;
                break;
            case "append":
                locales[locale][`${itemID} Description`] = originalDescription + addToDescription;
                break;
        }
    }
    getItemSlotDensity(itemID) {
        return items[itemID]._props.Width * items[itemID]._props.Height / items[itemID]._props.StackMaxSize;
    }
    calculateArmorLevel(penetrationValue) {
        // Values are taken from NoFoodAfterMidnight's EFT Ammo/Armor charts
        return (penetrationValue > 46) ? 6
            : (penetrationValue > 40) ? 5
                : (penetrationValue > 31) ? 4
                    : (penetrationValue > 25) ? 3
                        : (penetrationValue > 15) ? 2
                            : (penetrationValue > 6) ? 1
                                : 0;
    }
    getItemInHandbook(itemID) {
        return handbook.Items.filter(i => i.Id === itemID)[0]; // Outs: @Id, @ParentId, @Price
    }
    getBestTrader(handbookParentId) {
        let traderSellCategory = "";
        let traderMulti = 0.54;
        let altTraderSellCategory = "";
        let traderName = "";
        let handbookCategories = handbook.Categories.filter(i => i.Id === handbookParentId)[0];
        // log(handbookCategories)
        traderSellCategory = handbookCategories.Id;
        altTraderSellCategory = handbookCategories.ParentId;
        for (let i = 0; i < 8; i++) {
            if (traderList[i].base.sell_category.includes(traderSellCategory) || traderList[i].base.sell_category.includes(altTraderSellCategory)) {
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
    getItemBestPrice(itemID) {
        let itemBasePrice = 1;
        let handbookItem = this.getItemInHandbook(itemID);
        let bestTrader = this.getBestTrader(handbookItem.ParentId);
        let result = parseInt(handbookItem.Price * bestTrader.multi);
        return {
            price: result,
            name: bestTrader.name,
            ParentId: handbookItem.ParentId,
        };
    }
    getFleaPrice(itemID) {
        if (typeof fleaPrices[itemID] != "undefined") {
            return fleaPrices[itemID];
        }
        return this.getItemBestPrice(itemID).price;
    }
    buyableGenarator(itemID) {
        let barterString = "";
        let rarityArray = [];
        let tradesArray = [];
        for (let trader = 0; trader < 7; trader++) // iterate excluding Fence sales.
         {
            for (let barter of traderList[trader].assort.items) // iterate all seller barters 
             {
                if (barter._tpl == itemID && barter.parentId === "hideout") // find itemid in barter results 
                 {
                    let barterID = barter._id;
                    let barterResources = traderList[trader].assort.barter_scheme[barterID][0];
                    let barterLoyaltyLevel = traderList[trader].assort.loyal_level_items[barterID];
                    let traderName = traderList[trader].base.nickname;
                    let totalBarterPrice = 0;
                    barterString += `Bought @ ${traderName} lv.${barterLoyaltyLevel} > `;
                    let isBarter = false;
                    for (let resource of barterResources) {
                        if (resource._tpl == "5449016a4bdc2d6f028b456f") {
                            barterString += `${Math.round(resource.count)}₽ + `;
                        }
                        else if (resource._tpl == "569668774bdc2da2298b4568") {
                            barterString += `${Math.round(resource.count)}€ ≈ ${Math.round(179 * resource.count)}₽ + `;
                        }
                        else if (resource._tpl == "5696686a4bdc2da3298b456a") {
                            barterString += `$${Math.round(resource.count)} ≈ ${Math.round(160 * resource.count)}₽ + `;
                        }
                        else {
                            totalBarterPrice += this.getFleaPrice(resource._tpl) * resource.count;
                            barterString += this.getItemShortName(resource._tpl);
                            barterString += ` ×${resource.count} + `;
                            isBarter = true;
                        }
                    }
                    if (isBarter) {
                        rarityArray.push(barterLoyaltyLevel + 4);
                        tradesArray.push(((traderName != "Peacekeeper") ? traderName.slice(0, 1) : "K") + barterLoyaltyLevel + "b");
                    }
                    else {
                        rarityArray.push(barterLoyaltyLevel);
                        tradesArray.push(((traderName != "Peacekeeper") ? traderName.slice(0, 1) : "K") + barterLoyaltyLevel);
                    }
                    if (totalBarterPrice != 0) {
                        totalBarterPrice = ` | Σ ≈ ${Math.round(totalBarterPrice)}₽`;
                    }
                    else {
                        totalBarterPrice = "";
                    }
                    barterString = barterString.slice(0, barterString.length - 3) + totalBarterPrice + "\n";
                }
            }
        }
        return {
            string: barterString,
            rarity: rarityArray.sort(),
            trades: tradesArray
        };
    }
    usedForTradesGenarator(itemID, addExtendedString = true) {
        let baseBarterString = "";
        let rarityArray = [];
        for (let trader = 0; trader < 7; trader++) // iterate excluding Fence sales.
         {
            for (let barterID in traderList[trader].assort.barter_scheme) // iterate all seller barters 
             {
                for (let srcs in traderList[trader].assort.barter_scheme[barterID][0]) {
                    if (traderList[trader].assort.barter_scheme[barterID][0][srcs]._tpl == itemID) {
                        let barterResources = traderList[trader].assort.barter_scheme[barterID][0];
                        let bartedForItem;
                        let totalBarterPrice = 0;
                        let barterLoyaltyLevel = traderList[trader].assort.loyal_level_items[barterID];
                        for (let originalBarter in traderList[trader].assort.items) {
                            if (traderList[trader].assort.items[originalBarter]._id == barterID) {
                                bartedForItem = traderList[trader].assort.items[originalBarter]._tpl;
                            }
                        }
                        rarityArray.push(barterLoyaltyLevel);
                        baseBarterString += `Traded ×${traderList[trader].assort.barter_scheme[barterID][0][srcs].count}`;
                        baseBarterString += ` @ ${traderList[trader].base.nickname} lv.${barterLoyaltyLevel} > ${this.getItemName(bartedForItem)}`;
                        let extendedBarterString = " < … + ";
                        for (let barterResource in barterResources) {
                            totalBarterPrice += this.getFleaPrice(barterResources[barterResource]._tpl) * barterResources[barterResource].count;
                            if (barterResources[barterResource]._tpl != itemID) {
                                extendedBarterString += this.getItemShortName(barterResources[barterResource]._tpl);
                                extendedBarterString += ` ×${barterResources[barterResource].count} + `;
                            }
                        }
                        if (totalBarterPrice != 0) {
                            totalBarterPrice = ` | Δ ≈ ${Math.round(this.getFleaPrice(bartedForItem) - totalBarterPrice)}₽`;
                        }
                        else {
                            totalBarterPrice = "";
                        }
                        extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3);
                        extendedBarterString += totalBarterPrice;
                        if (addExtendedString == false) {
                            extendedBarterString = "";
                        }
                        baseBarterString += extendedBarterString + "\n";
                    }
                }
            }
        }
        // console.log(baseBarterString);
        return {
            string: baseBarterString,
            rarity: rarityArray.sort(),
        };
    }
    getCraftingAreaName(areaType) {
        let stringName = `hideout_area_${areaType}_name`;
        return locales['en'][stringName]; // INT8
    }
    getCraftingRarity(areaType, Level) {
        for (let s in hideoutAreas[areaType].stages) {
            if (s > 1) {
                return Level + 1;
            }
            else {
                return 4;
            }
        }
    }
    craftableGenarator(itemID) {
        let craftableString = "";
        let rarityArray = [];
        for (let recipeId in hideoutProduction) {
            if (itemID === hideoutProduction[recipeId].endProduct && hideoutProduction[recipeId].areaType != "21") // Find every recipe for itemid and don't use Christmas Tree crafts
             {
                let recipe = hideoutProduction[recipeId];
                let componentsString = "";
                let recipeAreaString = "";
                let totalRecipePrice = 0;
                let recipeDivision = "";
                for (let i = recipe.requirements.length - 1; i >= 0; i--) // Itterate 
                 {
                    if (recipe.requirements[i].type === "Area") {
                        let recipeArea = recipe.requirements[i]; // Find and save craft area object
                        recipeAreaString = this.getCraftingAreaName(recipeArea.areaType) + " lv." + recipeArea.requiredLevel;
                        rarityArray.push(this.getCraftingRarity(recipeArea.areaType, recipeArea.requiredLevel));
                    }
                    if (recipe.requirements[i].type === "Item") {
                        let craftComponentId = recipe.requirements[i].templateId;
                        let craftComponentCount = recipe.requirements[i].count;
                        let craftComponentPrice = this.getFleaPrice(craftComponentId);
                        componentsString += this.getItemShortName(craftComponentId) + " ×" + craftComponentCount + " + ";
                        totalRecipePrice += craftComponentPrice * craftComponentCount;
                    }
                }
                if (recipe.count > 1) {
                    recipeDivision = " per item";
                }
                componentsString = componentsString.slice(0, componentsString.length - 3);
                craftableString += `Crafted ×${recipe.count} @ ${recipeAreaString} < `;
                craftableString += `${componentsString} | Σ${recipeDivision} ≈ ${Math.round(totalRecipePrice / recipe.count)}₽\n`;
                // this.AddToItemDescription(itemID, componentsString + ", at total price per item: " + Math.round(totalRecipePrice/recipe.count) + "\n", "prepend");
                // this.AddToItemDescription(itemID, recipe.count + " can be crafted at " + recipeAreaString + " with:", "prepend");
                // if (fleaPrice > totalRecipePrice/recipe.count) {
                // 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
                // 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + this.GetItemName(id) + " can be crafted at " + recipeAreaString)
                // }
            }
        }
        return craftableString;
    }
    usedForHideoutGenerator(itemID) {
        let hideoutString = "";
        for (let area in hideoutAreas) {
            for (let s in hideoutAreas[area].stages) {
                for (let a in hideoutAreas[area].stages[s].requirements) {
                    if (hideoutAreas[area].stages[s].requirements[a].templateId == itemID) {
                        hideoutString += `Need ×${hideoutAreas[area].stages[s].requirements[a].count} > ${this.getCraftingAreaName(hideoutAreas[area].type)} lv.${s}\n`;
                    }
                }
            }
        }
        // console.log(hideoutString)
        return hideoutString;
    }
    isItemUsedForCrafting(itemID) {
        let usedForCraftingString = "";
        let totalCraftingPrice = 0;
        for (let craftID in hideoutProduction) {
            for (let s in hideoutProduction[craftID].requirements) {
                if (hideoutProduction[craftID].requirements[s].templateId == itemID) {
                    let usedForCraftingComponentsString = " < … + ";
                    let recipeAreaString = "";
                    let totalRecipePrice = 0;
                    for (let i = hideoutProduction[craftID].requirements.length - 1; i >= 0; i--) // Itterate 
                     {
                        if (hideoutProduction[craftID].requirements[i].type == "Area") {
                            recipeAreaString = this.getCraftingAreaName(hideoutProduction[craftID].requirements[i].areaType) + " lv." + hideoutProduction[craftID].requirements[i].requiredLevel;
                        }
                        if (hideoutProduction[craftID].requirements[i].type == "Item") {
                            let craftComponent = hideoutProduction[craftID].requirements[i];
                            if (craftComponent.templateId != itemID) {
                                usedForCraftingComponentsString += this.getItemShortName(craftComponent.templateId) + " ×" + craftComponent.count + " + ";
                            }
                            totalRecipePrice += this.getFleaPrice(craftComponent.templateId) * craftComponent.count;
                        }
                    }
                    usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3);
                    usedForCraftingComponentsString += ` | Δ ≈ ${Math.round(this.getFleaPrice(hideoutProduction[craftID].endProduct) - totalRecipePrice)}₽`;
                    usedForCraftingString += `Part ×${hideoutProduction[craftID].requirements[s].count} > ${this.getItemName(hideoutProduction[craftID].endProduct)} ×${hideoutProduction[craftID].count}`;
                    usedForCraftingString += ` @ ${recipeAreaString + usedForCraftingComponentsString}\n`;
                }
            }
        }
        // console.log(hideoutString)
        return usedForCraftingString;
    }
    usedForQuestGenerator(itemID) {
        let questString = "";
        for (let questID in quests) {
            let questConditions = quests[questID].conditions.AvailableForFinish;
            for (let i in questConditions) {
                if (questConditions[i]._parent == "HandoverItem" && questConditions[i]._props.target[0] == itemID) {
                    let trader = quests[questID].traderId;
                    questString += `Found ${(questConditions[i]._props.onlyFoundInRaid) ? "(✔) " : ""}×${questConditions[i]._props.value} > ${quests[questID].QuestName} @ ${tables.traders[trader].base.nickname}\n`;
                }
            }
        }
        return questString;
    }
}
const log = (i) => {
    console.log(i);
};
module.exports = { mod: new ItemInfo() };
