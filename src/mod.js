"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const LogBackgroundColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogBackgroundColor");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const config_json_1 = __importDefault(require("../config/config.json"));
const tiers_json_1 = __importDefault(require("../config/tiers.json"));
const translations_json_1 = __importDefault(require("./translations.json"));
// Using `this.` is perfectly fine. Much better than having ambiguous and typeless variables declared in some global scope
// Don't worry - there's always opportunities to learn :) - Terkoiz
const newLine = "\n";
const bsgBlacklist = [
    "62e7e7bbe6da9612f743f1e0",
    "6357c98711fb55120211f7e1",
    "5cfe8010d7ad1a59283b14c6",
    "5c6175362e221600133e3b94",
    "59c1383d86f774290a37e0ca",
    "544a37c44bdc2d25388b4567",
    "5c0558060db834001b735271",
    "5d1b5e94d7ad1a2b865a96b0",
    "5a1eaa87fcdbcb001865f75e",
    "606587252535c57a13424cfd",
    "5dcbd56fdbd3d91b3e5468d5",
    "6183afd850224f204c1da514",
    "6165ac306ef05c2ce828ef74",
    "628a60ae6b1d481ff772e9c8",
    "5e81ebcd8e146c7080625e15",
    "620109578d82e67e7911abf2",
    "62178c4d4ecf221597654e3d",
    "6176aca650224f204c1da3fb",
    "5df8ce05b11454561e39243b",
    "5aafa857e5b5b00018480968",
    "5fc22d7c187fea44d52eda44",
    "5a367e5dc4a282000e49738f",
    "6275303a9f372d6ea97f9ec7",
    "5e848cc2988a8701445df1e8",
    "627e14b21713922ded6f2c15",
    "5c091a4e0db834001d5addc8",
    "5aa7e276e5b5b000171d0647",
    "5f60c74e3b85f6263c145586",
    "5ca20ee186f774799474abc2",
    "5a154d5cfcdbcb001a3b00da",
    "5ac8d6885acfc400180ae7b0",
    "5c17a7ed2e2216152142459c",
    "5c0e874186f7745dc7616606",
    "5f60b34a41e30a4ab12a6947",
    "5e00c1ad86f774747333222c",
    "5e01ef6886f77445f643baa4",
    "5c0e625a86f7742d77340f62",
    "545cdb794bdc2d3a198b456a",
    "5c0e541586f7747fa54205c9",
    "60a283193cb70855c43a381d",
    "63737f448b28897f2802b874",
    "5b44cd8b86f774503d30cba2",
    "5b44cf1486f77431723e3d05",
    "5b44d0de86f774503d30cba8",
    "5f5f41476bdad616ad46d631",
    "5ca2151486f774244a3b8d30",
    "5ca21c6986f77479963115a7",
    "5ab8e79e86f7742d8b372e78",
    "5e9dacf986f774054d6b89f4",
    "5fd4c474dd870108a754b241",
    "5e4abb5086f77406975c9342",
    "6038b4ca92ec1c3103795a0d",
    "6038b4b292ec1c3103795a0b",
    "62963c18dbc8ab5f0d382d0b",
    "62a61bbf8ec41a51b34758d2",
    "60a7ad3a0c5cb24b0134664a",
    "60a7ad2a2198820d95707a2e",
    "5ca2113f86f7740b2547e1d2",
    "5a16b7e1fcdbcb00165aa6c9",
    "5c0919b50db834001b7ce3b9",
    "5f60c85b58eff926626a60f7",
    "5e00cdd986f7747473332240",
    "5e01f37686f774773c6f6c15",
    "619bc61e86e01e16f839a999",
    "619bddc6c9546643a67df6ee",
    "619bddffc9546643a67df6f0",
    "619bde3dc9546643a67df6f2",
    "619bdeb986e01e16f839a99e",
    "619bdf9cc9546643a67df6f8",
    "5e4ac41886f77406a511c9a8",
    "544a5caa4bdc2d1a388b4568",
    "609e860ebd219504d8507525",
    "628d0618d1ba6e4fa07ce5a4",
    "61bc85697113f767765c7fe7",
    "5d5d87f786f77427997cfaef",
    "628dc750b910320f4c27a732",
    "5c0e746986f7741453628fe5",
    "61bcc89aef0f505f0c6cd0fc",
    "628b9784bcf6e2659e09b8a2",
    "628b9c7d45122232a872358f",
    "60a3c70cde5f453f634816a3",
    "60a3c68c37ea821725773ef5",
    "639343fce101f4caa40a4ef3",
    "5b44cad286f77402a54ae7e5",
    "628cd624459354321c4b7fa2",
    "5c0e774286f77468413cc5b2",
    "59e763f286f7742ee57895da",
    "5df8a4d786f77412672a1e3b",
    "6034d2d697633951dc245ea6",
    "5ab8ebf186f7742d8b372e80",
    "639346cc1c8f182ad90c8972",
    "5f5e46b96bdad616ad46d613",
    "61b9e1aaef9a1b5d6a79899a",
    "5c0e805e86f774683f3dd637",
    "5857a8bc2459772bad15db29",
    "5c093ca986f7740a1867ab12",
    "5857a8b324597729ab0a0e7d",
    "59db794186f77448bc595262",
    "544a11ac4bdc2d470e8b456a",
    "5732ee6a24597719ae0c0281",
    "5c0a840b86f7742ffa4f2482",
    "5b7c710788a4506dec015957",
    "5b6d9ce188a4501afc1b2b25",
    "614451b71e5874611e2c7ae5",
    "6389c8fb46b54c634724d847",
    "6389c92d52123d5dd17f8876",
    "593962ca86f774068014d9af",
    "5937ee6486f77408994ba448",
    "63a39e1d234195315d4020bd",
    "5c94bbff86f7747ee735c08f",
    "62e910aaf957f2915e0a5e36",
    "63a0b2eabea67a6d93009e52",
    "5efb0cabfb3e451d70735af5",
    "5cadf6eeae921500134b2799",
    "5d6e68a8a4b9360b6c0d54e2",
    "5d6e68b3a4b9361bca7e50b5",
    "5d6e68d1a4b93622fe60e845",
    "5e85a9f4add9fe03027d9bf1",
    "62389aaba63f32501b1b444f",
    "62389ba9a63f32501b1b4451",
    "5ede474b0c226a66f5402622",
    "5f0c892565703e5c461894e9",
    "5ede47405b097655935d7d16",
    "5ba26835d4351e0035628ff5",
    "5ba26844d4351e00334c9475",
    "5c0d5e4486f77478390952fe",
    "61962b617c6c7b169525f168",
    "56dff026d2720bb8668b4567",
    "56dff061d2720bb5668b4567",
    "54527ac44bdc2d36668b4567",
    "59e6906286f7746c9f75e847",
    "59e690b686f7746c9f75e848",
    "601949593ae8f707c4608daa",
    "5cc80f67e4a949035e43bbba",
    "5cc80f38e4a949001152b560",
    "5c0d688c86f77413ae3407b2",
    "5fc382b6d6fa9c00c571bbc3",
    "5fd20ff893a8961fc660a954",
    "59e0d99486f7744a32234762",
    "601aa3d2b2bcb34913271e6d",
    "5a6086ea4f39f99cd479502f",
    "5a608bf24f39f98ffc77720e",
    "58dd3ad986f77403051cba8f",
    "5efb0c1bd79ff02a1f5e68d9",
    "5e023d48186a883be655e551",
    "5fc382a9d724d907e2077dab",
    "5fc275cf85fd526b824a571a",
    "5a26ac0ec4a28200741e1e18",
    "5e023d34e8a400319a28ed44",
    "560d61e84bdc2da74d8b4571",
    "5efb0da7a29a85116f6ea05f",
    "5c925fa22e221601da359b7b",
    "61962d879bb3d20b0946d385",
    "57a0e5022459774d1673f889",
    "5c0d668f86f7747ccb7f13b2",
    "635267f063651329f75a4ee8",
    "57372b832459776701014e41",
    "5c1262a286f7743f8a69aab2",
    "57372bd3245977670b7cd243",
    "57372c21245977670937c6c2",
    "57372c89245977685d4159b1",
    "5c1260dc86f7746b106e8748",
    "57372bad245977670b7cd242",
    "57372c56245977685e584582",
    "617fd91e5539a84ec44ce155",
    "618a431df1eb8e24b8741deb",
    "6389c7f115805221fb410466",
    "6389c7750ef44505c87f5996",
    "6389c85357baa773a825b356",
    "59faff1d86f7746c51718c9c",
    "5df8a6a186f77412640e2e80",
    "5df8a72c86f77412640e2e83",
    "5df8a77486f77412672a1e3f",
    "59f32bb586f774757e1e8442",
    "59f32c3b86f77472a31742f0", // Dogtag USEC
];
class ItemInfo {
    init(container) {
        this.database = container.resolve("DatabaseServer");
        this.configServer = container.resolve("ConfigServer");
        this.itemBaseClassService = container.resolve("ItemBaseClassService");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        this.hideoutConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.HIDEOUT);
        this.logger.info("[Item Info] Database data is loaded, working...");
        this.tables = this.database.getTables();
        this.items = this.tables.templates.items;
        this.handbook = this.tables.templates.handbook;
        this.locales = this.tables.locales.global;
        this.fleaPrices = this.tables.templates.prices;
        this.hideoutProduction = this.tables.hideout.production;
        this.hideoutAreas = this.tables.hideout.areas;
        this.quests = this.tables.templates.quests;
        this.armors = this.tables.globals.config.ArmorMaterials;
        this.traders = this.tables.traders;
        // Hardcode list for best buy_price_coef
        this.traderList = [
            this.traders[Traders_1.Traders.THERAPIST],
            this.traders[Traders_1.Traders.RAGMAN],
            this.traders[Traders_1.Traders.JAEGER],
            this.traders[Traders_1.Traders.MECHANIC],
            this.traders[Traders_1.Traders.PRAPOR],
            this.traders[Traders_1.Traders.SKIER],
            this.traders[Traders_1.Traders.PEACEKEEPER],
        ];
    }
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        // TODO: With order.json being a thing, this can probably be removed and instead instructions for changing load order could be added
        if (config_json_1.default.delay.enabled) {
            this.logger.log(`[Item Info] Mod compatibility delay enabled (${config_json_1.default.delay.seconds} seconds), waiting for other mods data to load...`, LogTextColor_1.LogTextColor.BLACK, LogBackgroundColor_1.LogBackgroundColor.CYAN);
            setTimeout(() => {
                this.init(container);
                this.ItemInfoMain();
            }, config_json_1.default.delay.seconds * 1000);
        }
        else {
            this.init(container);
            this.ItemInfoMain();
        }
    }
    ItemInfoMain() {
        let userLocale = config_json_1.default.UserLocale;
        if (!config_json_1.default.HideLanguageAlert) {
            this.logger.log("[Item Info] This mod supports other languages! \nМод поддерживает другие языки! \nEste mod es compatible con otros idiomas! \nTen mod obsługuje inne języki! \nEnglish, Russian, Spanish, Korean, French and Chinese are fully translated.\nHide this message in config.json", LogTextColor_1.LogTextColor.BLACK, LogBackgroundColor_1.LogBackgroundColor.WHITE);
            this.logger.log(`[Item Info] Your selected language is "${userLocale}". \nYou can now customise it in Item Info config.json file. \nLooking for translators, PM me! \nTranslation debug mode is availiable in translations.json`, LogTextColor_1.LogTextColor.BLACK, LogBackgroundColor_1.LogBackgroundColor.GREEN);
        }
        if (translations_json_1.default.debug.enabled) {
            this.logger.warning(`Translation debugging mode enabled! Changing userLocale to ${translations_json_1.default.debug.languageToDebug}`);
            userLocale = translations_json_1.default.debug.languageToDebug;
        }
        // Fill the missing translation dictionaries with English keys as a fallback + debug mode to help translations. Smart.
        for (const key in translations_json_1.default["en"]) {
            for (const lang in translations_json_1.default) {
                if (translations_json_1.default.debug.enabled &&
                    lang != "en" &&
                    lang == translations_json_1.default.debug.languageToDebug &&
                    translations_json_1.default[translations_json_1.default.debug.languageToDebug][key] == translations_json_1.default["en"][key] &&
                    key != "") {
                    this.logger.warning(translations_json_1.default.debug.languageToDebug + ` language "${translations_json_1.default[translations_json_1.default.debug.languageToDebug][key]}" is the same as in English`);
                }
                if (key in translations_json_1.default[lang] == false) {
                    if (translations_json_1.default.debug.enabled && translations_json_1.default.debug.languageToDebug == lang) {
                        this.logger.warning(`${lang} language is missing "${key}" transaition!`);
                    }
                    translations_json_1.default[lang][key] = translations_json_1.default["en"][key];
                }
            }
        }
        // Description generator for .md
        //const descriptionGen = false
        //if (descriptionGen) {
        //	for (const conf in config) {
        //		log("## " + conf)
        //		log("" + config[conf]._description)
        //		log("> " + config[conf]._example)
        //		log(newLine)
        //	}
        //}
        //for (const userLocale in locales){
        // Put main item loop here to make the mod universally international.
        // Insane loading times each time provided for free.
        // In theory, the whole thing can be *slightly* optimised locally, per function with dictionaries, with language arrays for each generated string, etc, but it's a MAJOR refactoring of the whole codebase, and it's not worth the hassle and my sanity.
        // Let the user select their preferred locale in config once, this will save A LOT of time for everybody, that's good enough solution.
        // I'll just pretend I thought about it beforehand and will call it "in hindsight optimization". Cheers.
        // P.S. Is there a way to access last user selected locale at IPreAkiLoadMod?
        //}
        this.euroRatio = this.handbook.Items.find((x) => x.Id == "569668774bdc2da2298b4568").Price;
        this.dollarRatio = this.handbook.Items.find((x) => x.Id == "5696686a4bdc2da3298b456a").Price;
        for (const itemID in this.items) {
            const item = this.items[itemID];
            const itemInHandbook = this.getItemInHandbook(itemID);
            if (item._type === "Item" && // Check if the item is a real item and not a "node" type.
                itemInHandbook != undefined && // Ignore "useless" items
                !item._props.QuestItem && // Ignore quest items.
                item._parent != "543be5dd4bdc2deb348b4569" // Ignore currencies.
            ) {
                // let name = this.getItemName(itemID, userLocale) // for debug only
                // item._props.ExaminedByDefault = true
                const i18n = translations_json_1.default[userLocale];
                // boilerplate defaults
                let descriptionString = "";
                let priceString = "";
                let barterString = "";
                let productionString = "";
                let usedForBarterString = "";
                let usedForQuestsString = "";
                let usedForHideoutString = "";
                let usedForCraftingString = "";
                let armorDurabilityString = "";
                let spawnChanceString = "";
                let slotefficiencyString = "";
                let headsetDescription = "";
                let tier = "";
                let itemRarity = 0;
                let spawnString = "";
                let fleaPrice = this.getFleaPrice(itemID);
                let itemBestVendor = this.getItemBestTrader(itemID, userLocale);
                let traderPrice = Math.round(itemBestVendor.price);
                let traderName = itemBestVendor.name;
                let spawnChance = 10; // DEGUG
                let slotDensity = this.getItemSlotDensity(itemID);
                let itemBarters = this.bartersResolver(itemID);
                let barterInfo = this.barterInfoGenerator(itemBarters, userLocale);
                let barterResourceInfo = this.barterResourceInfoGenerator(itemID, userLocale);
                let rarityArray = [];
                rarityArray.push(barterInfo.rarity); // futureprofing, add other rarity calculations
                itemRarity = Math.min(...rarityArray);
                let isBanned = false;
                if (config_json_1.default.useBSGStaticFleaBanlist) {
                    isBanned = bsgBlacklist.includes(itemID);
                }
                else {
                    isBanned = !item._props.CanSellOnRagfair;
                }
                if (isBanned) {
                    fleaPrice = i18n.BANNED;
                    if (!itemRarity) {
                        itemRarity = 7;
                    }
                }
                if (item._parent == "543be5cb4bdc2deb348b4568") {
                    // Ammo boxes special case
                    let count = item._props.StackSlots[0]._max_count;
                    let ammo = item._props.StackSlots[0]._props.filters[0].Filter[0];
                    let value = this.getItemBestTrader(ammo).price;
                    // let value = this.getItemInHandbook(ammo).price
                    traderPrice = value * count;
                    if (!itemRarity) {
                        itemRarity = this.barterInfoGenerator(this.bartersResolver(ammo)).rarity;
                    }
                }
                if (config_json_1.default.BulletStatsInName.enabled) {
                    if (item._props.ammoType === "bullet" || item._props.ammoType === "buckshot") {
                        let damageMult = 1;
                        if (item._props.ammoType === "buckshot") {
                            damageMult = item._props.buckshotBullets;
                        }
                        this.addToName(itemID, ` (${item._props.Damage * damageMult}/${item._props.PenetrationPower})`, "append");
                    }
                }
                if (config_json_1.default.FleaAbusePatch.enabled) {
                    if (fleaPrice * this.ragfairConfig.dynamic.price.min < traderPrice && !isBanned) {
                        // Ignore banned items for compatibility with Softcore mod.
                        // log(name)
                        let fleaPriceFix = Math.round(traderPrice * (1 / this.ragfairConfig.dynamic.price.min + 0.01));
                        this.fleaPrices[itemID] = fleaPriceFix;
                        fleaPrice = fleaPriceFix;
                    }
                }
                if (config_json_1.default.RarityRecolor.enabled && !config_json_1.default.RarityRecolorBlacklist.includes(item._parent)) {
                    // item._props.BackgroundColor = "grey"
                    for (const customItem in config_json_1.default.RarityRecolor.customRarity) {
                        if (customItem == itemID) {
                            itemRarity = config_json_1.default.RarityRecolor.customRarity[customItem];
                        }
                    }
                    if (itemRarity == 7) {
                        tier = i18n.OVERPOWERED;
                        item._props.BackgroundColor = tiers_json_1.default.OVERPOWERED;
                    }
                    else if (itemRarity == 1) {
                        tier = i18n.COMMON;
                        item._props.BackgroundColor = tiers_json_1.default.COMMON;
                    }
                    else if (itemRarity == 2) {
                        tier = i18n.RARE;
                        item._props.BackgroundColor = tiers_json_1.default.RARE;
                    }
                    else if (itemRarity == 3) {
                        tier = i18n.EPIC;
                        item._props.BackgroundColor = tiers_json_1.default.EPIC;
                    }
                    else if (itemRarity == 4) {
                        tier = i18n.LEGENDARY;
                        item._props.BackgroundColor = tiers_json_1.default.LEGENDARY;
                    }
                    else if (itemRarity == 5) {
                        tier = i18n.UBER;
                        item._props.BackgroundColor = tiers_json_1.default.UBER;
                    }
                    else if (spawnChance < 2 || itemRarity == 6) {
                        // can get 6 from custom rules only
                        tier = i18n.UNOBTAINIUM;
                        item._props.BackgroundColor = tiers_json_1.default.UNOBTAINIUM;
                    }
                    else if (itemRarity == 8) {
                        // 8 is for custom dim red background
                        tier = i18n.CUSTOM;
                        item._props.BackgroundColor = tiers_json_1.default.CUSTOM;
                    }
                    else if (itemRarity == 9) {
                        // 8 is for custom dim orange background
                        // tier = i18n.CUSTOM2
                        item._props.BackgroundColor = tiers_json_1.default.CUSTOM2;
                    }
                    if (config_json_1.default.RarityRecolor.fallbackValueBasedRecolor && itemRarity == 0) {
                        let itemValue = itemInHandbook.Price;
                        if (item._props.StackMaxSize > 1) {
                            // log(`"${itemID}", // ${name}`)
                            itemValue = itemInHandbook.Price * item._props.StackMaxSize;
                        }
                        let itemSlots = item._props.Width * item._props.Height;
                        if (itemSlots > 1) {
                            itemValue = Math.round(itemValue / itemSlots);
                        }
                        // log(`"${itemID}", // ${name}, ${item._props.BackgroundColor}, ${itemValue}`)
                        if (item._parent == "543be5cb4bdc2deb348b4568") {
                            // Ammo boxes special case
                            let count = item._props.StackSlots[0]._max_count;
                            let ammo = item._props.StackSlots[0]._props.filters[0].Filter[0];
                            let value = this.getItemInHandbook(ammo).Price;
                            itemValue = value * count;
                        }
                        // TODO: This will generate non-user friendly errors if they f*ck up their config. Maybe needs manual validation to ensure that all tiers.X values are numbers?
                        if (itemValue < Number.parseInt(tiers_json_1.default.COMMON_VALUE_FALLBACK)) {
                            // tier = i18n.COMMON
                            item._props.BackgroundColor = tiers_json_1.default.COMMON;
                        }
                        else if (itemValue < Number.parseInt(tiers_json_1.default.RARE_VALUE_FALLBACK)) {
                            // tier = i18n.RARE
                            item._props.BackgroundColor = tiers_json_1.default.RARE;
                        }
                        else if (itemValue < Number.parseInt(tiers_json_1.default.EPIC_VALUE_FALLBACK)) {
                            // tier = i18n.EPIC
                            item._props.BackgroundColor = tiers_json_1.default.EPIC;
                        }
                        else if (itemValue < Number.parseInt(tiers_json_1.default.LEGENDARY_VALUE_FALLBACK)) {
                            // tier = i18n.LEGENDARY
                            item._props.BackgroundColor = tiers_json_1.default.LEGENDARY;
                        }
                        else if (itemValue < Number.parseInt(tiers_json_1.default.UBER_VALUE_FALLBACK)) {
                            // tier = i18n.UBER
                            item._props.BackgroundColor = tiers_json_1.default.UBER;
                        }
                        else {
                            // log(`"${itemID}", // ${name}, ${item._props.BackgroundColor}, ${itemValue}`)
                            // tier = i18n.UNOBTAINIUM
                            item._props.BackgroundColor = tiers_json_1.default.UNOBTAINIUM;
                        }
                    }
                    if (config_json_1.default.RarityRecolor.addTierNameToPricesInfo) {
                        if (tier.length > 0) {
                            priceString += tier + " | ";
                        }
                    }
                }
                if (config_json_1.default.ArmorInfo.enabled) {
                    if (item._props.armorClass > 0) {
                        let armor = this.armors[item._props.ArmorMaterial];
                        // prettier-ignore
                        armorDurabilityString += `${config_json_1.default.ArmorInfo.addArmorClassInfo ? i18n.Armorclass + ": " + item._props.armorClass + " | " : ""}${i18n.Effectivedurability}: ${Math.round(item._props.MaxDurability / armor.Destructibility)} (${i18n.Max}: ${item._props.MaxDurability} x ${this.locales[userLocale][`Mat${(item._props.ArmorMaterial)}`]}: ${roundWithPrecision(1 / armor.Destructibility, 1)}) | ${i18n.Repairdegradation}: ${Math.round(armor.MinRepairDegradation * 100)}% - ${Math.round(armor.MaxRepairDegradation * 100)}%` + newLine + newLine;
                        //log(name)
                        //log(armorDurabilityString)
                    }
                }
                if (config_json_1.default.ContainerInfo.enabled) {
                    if (item._props.Grids?.length > 0) {
                        let totalSlots = 0;
                        for (const grid of item._props.Grids) {
                            totalSlots += grid._props.cellsH * grid._props.cellsV;
                        }
                        let slotefficiency = roundWithPrecision(totalSlots / (item._props.Width * item._props.Height), 2);
                        // prettier-ignore
                        slotefficiencyString += `${i18n.Slotefficiency}: ×${slotefficiency} (${totalSlots}/${item._props.Width * item._props.Height})` + newLine + newLine;
                        // log(name)
                        // log(slotefficiencyString)
                    }
                }
                if (config_json_1.default.MarkValueableItems.enabled) {
                    let itemvalue = traderPrice / slotDensity;
                    let fleaValue;
                    if (isBanned) {
                        // For banned items, recalculate flea price.
                        fleaValue = this.getFleaPrice(itemID) / slotDensity;
                        if (config_json_1.default.MarkValueableItems.alwaysMarkBannedItems) {
                            fleaValue = config_json_1.default.MarkValueableItems.fleaSlotValueThresholdBest + 1; // always mark flea banned items as best.
                        }
                    }
                    else {
                        fleaValue = fleaPrice / slotDensity;
                    }
                    if (this.items[itemID]._parent != "5795f317245977243854e041") {
                        // ignore containers
                        if (itemvalue > config_json_1.default.MarkValueableItems.traderSlotValueThresholdBest || fleaValue > config_json_1.default.MarkValueableItems.fleaSlotValueThresholdBest) {
                            if (config_json_1.default.MarkValueableItems.addToShortName) {
                                this.addToShortName(itemID, "★", "prepend");
                            }
                            if (config_json_1.default.MarkValueableItems.addToName) {
                                this.addToName(itemID, "★", "append");
                            }
                        }
                        else if (itemvalue > config_json_1.default.MarkValueableItems.traderSlotValueThresholdGood || fleaValue > config_json_1.default.MarkValueableItems.fleaSlotValueThresholdGood) {
                            if (config_json_1.default.MarkValueableItems.addToShortName) {
                                this.addToShortName(itemID, "☆", "prepend");
                            }
                            if (config_json_1.default.MarkValueableItems.addToName) {
                                this.addToName(itemID, "☆", "append");
                            }
                        }
                    }
                }
                if (config_json_1.default.PricesInfo.enabled) {
                    // prettier-ignore
                    priceString += (config_json_1.default.PricesInfo.addFleaPrice ? i18n.Fleaprice + ": " + this.formatPrice(fleaPrice) + (fleaPrice > 0 ? "₽" : "") + " | " : "") + i18n.Valuation1 + traderName + i18n.Valuation2 + ": " + this.formatPrice(traderPrice) + "₽" + newLine + newLine;
                    // log(priceString)
                }
                if (config_json_1.default.HeadsetInfo.enabled) {
                    if (item._props.Distortion !== undefined) {
                        let gain = item._props.CompressorGain;
                        let thresh = item._props.CompressorTreshold;
                        // prettier-ignore
                        headsetDescription = `${i18n.AmbientVolume}: ${item._props.AmbientVolume}dB | ${i18n.Compressor}: ${i18n.Gain} +${gain}dB × ${i18n.Treshold} ${thresh}dB ≈ ×${Math.abs((gain * thresh) / 100)} ${i18n.Boost} | ${i18n.ResonanceFilter}: ${item._props.Resonance}@${item._props.CutoffFreq}Hz | ${i18n.Distortion}: ${Math.round(item._props.Distortion * 100)}%` + newLine + newLine;
                        // log(name)
                        // log(headsetDescription)
                    }
                }
                if (config_json_1.default.BarterInfo.enabled) {
                    if (barterInfo.barters.length > 1) {
                        barterString = barterInfo.barters + newLine;
                        // log(name)
                        // log(barterString)
                    }
                }
                if (config_json_1.default.ProductionInfo.enabled) {
                    let productionInfo = this.productionGenarator(itemID, userLocale);
                    if (productionInfo.length > 1) {
                        productionString = productionInfo + newLine;
                        // log(name)
                        // log(productionString)
                    }
                }
                if (config_json_1.default.BarterResourceInfo.enabled) {
                    if (barterResourceInfo.length > 1) {
                        usedForBarterString = barterResourceInfo + newLine;
                        // log(name)
                        // log(usedForBarterString)
                    }
                }
                if (config_json_1.default.QuestInfo.enabled) {
                    const itemQuestInfo = this.QuestInfoGenerator(itemID, userLocale);
                    if (itemQuestInfo.length > 1) {
                        usedForQuestsString = itemQuestInfo + newLine;
                        // item._props.BackgroundColor = "tracerGreen"
                        if (config_json_1.default.QuestInfo.FIRinName && itemQuestInfo.includes("✔")) {
                            this.addToName(itemID, "✔", "append");
                            this.addToShortName(itemID, "", "prepend"); // ✔ is not shown in inventory icon font :(
                        }
                        // log(this.getItemName(itemID))
                        // log(usedForQuestsString)
                    }
                }
                if (config_json_1.default.HideoutInfo.enabled) {
                    const itemHideoutInfo = this.HideoutInfoGenerator(itemID, userLocale);
                    if (itemHideoutInfo.length > 1) {
                        usedForHideoutString = itemHideoutInfo + newLine;
                        // log(name)
                        // log(usedForHideoutString)
                    }
                }
                if (config_json_1.default.CraftingMaterialInfo.enabled) {
                    const itemCraftingMaterialInfo = this.CraftingMaterialInfoGenarator(itemID, userLocale);
                    if (itemCraftingMaterialInfo.length > 1) {
                        usedForCraftingString = itemCraftingMaterialInfo + newLine;
                        // log(name)
                        // log(usedForCraftingString)
                    }
                }
                descriptionString =
                    priceString +
                        spawnString +
                        spawnChanceString +
                        headsetDescription +
                        armorDurabilityString +
                        slotefficiencyString +
                        usedForQuestsString +
                        usedForHideoutString +
                        barterString +
                        productionString +
                        usedForCraftingString +
                        usedForBarterString;
                this.addToDescription(itemID, descriptionString, "prepend");
                const debug = false;
                if (debug) {
                    log(this.getItemName(itemID, userLocale));
                    log(descriptionString);
                    // log(this.getItemDescription(itemID, userLocale))
                    log("---");
                }
                // this.addToName(itemID, "✅✓✔☑🗸⍻√❎❌✖✗✘☒", "append");
            }
        }
        this.logger.success("[Item Info] Finished processing items, enjoy!");
        if (translations_json_1.default.debug.enabled) {
            let debugItemIDlist = [
                "590a3efd86f77437d351a25b",
                "5c0e722886f7740458316a57",
                "5645bcc04bdc2d363b8b4572",
                "590c621186f774138d11ea29",
                "59faff1d86f7746c51718c9c",
                "5c0e625a86f7742d77340f62",
                "5bb20dcad4351e3bac1212da",
            ];
            for (const debugItemID of debugItemIDlist) {
                this.logger.info("---");
                this.logger.info(newLine);
                this.logger.info(debugItemID);
                this.logger.info(this.getItemName(debugItemID, translations_json_1.default.debug.languageToDebug));
                this.logger.info(newLine);
                this.logger.info(this.getItemDescription(debugItemID, translations_json_1.default.debug.languageToDebug));
            }
        }
    }
    getItemName(itemID, locale = "en") {
        if (typeof this.locales[locale][`${itemID} Name`] != "undefined") {
            return this.locales[locale][`${itemID} Name`];
        }
        else if (typeof this.locales["en"][`${itemID} Name`] != "undefined") {
            return this.locales["en"][`${itemID} Name`];
        }
        else {
            return this.items[itemID]._props.Name; // If THIS fails, the modmaker REALLY fucked up
        }
    }
    getItemShortName(itemID, locale = "en") {
        if (typeof this.locales[locale][`${itemID} ShortName`] != "undefined") {
            return this.locales[locale][`${itemID} ShortName`];
        }
        else if (typeof this.locales["en"][`${itemID} ShortName`] != "undefined") {
            return this.locales["en"][`${itemID} ShortName`];
        }
        else {
            return this.items[itemID]._props.ShortName;
        }
    }
    getItemDescription(itemID, locale = "en") {
        if (typeof this.locales[locale][`${itemID} Description`] != "undefined") {
            return this.locales[locale][`${itemID} Description`];
        }
        else if (typeof this.locales["en"][`${itemID} Description`] != "undefined") {
            return this.locales["en"][`${itemID} Description`];
        }
        else {
            return this.items[itemID]._props.Description;
        }
    }
    formatPrice(price) {
        if (typeof price == "number" && config_json_1.default.FormatPrice) {
            return Intl.NumberFormat("en-US").format(price);
        }
        else {
            return price.toString();
        }
    }
    addToName(itemID, addToName, place, lang = "") {
        if (lang == "") {
            // I'm actually really proud of this one! If no lang argument is passed, it defaults to recursion for all languages.
            for (const locale in this.locales) {
                this.addToName(itemID, addToName, place, locale);
            }
        }
        else {
            let originalName = this.getItemName(itemID, lang);
            switch (place) {
                case "prepend":
                    this.locales[lang][`${itemID} Name`] = addToName + originalName;
                    break;
                case "append":
                    this.locales[lang][`${itemID} Name`] = originalName + addToName;
                    break;
            }
        }
    }
    addToShortName(itemID, addToShortName, place, lang = "") {
        if (lang == "") {
            for (const locale in this.locales) {
                this.addToShortName(itemID, addToShortName, place, locale);
            }
        }
        else {
            let originalShortName = this.getItemShortName(itemID, lang);
            switch (place) {
                case "prepend":
                    this.locales[lang][`${itemID} ShortName`] = addToShortName + originalShortName;
                    break;
                case "append":
                    this.locales[lang][`${itemID} ShortName`] = originalShortName + addToShortName;
                    break;
            }
        }
    }
    addToDescription(itemID, addToDescription, place, lang = "") {
        if (lang == "") {
            for (const locale in this.locales) {
                this.addToDescription(itemID, addToDescription, place, locale);
            }
        }
        else {
            let originalDescription = this.getItemDescription(itemID, lang);
            switch (place) {
                case "prepend":
                    this.locales[lang][`${itemID} Description`] = addToDescription + originalDescription;
                    break;
                case "append":
                    this.locales[lang][`${itemID} Description`] = originalDescription + addToDescription;
                    break;
            }
        }
    }
    getItemSlotDensity(itemID) {
        return (this.items[itemID]._props.Width * this.items[itemID]._props.Height) / this.items[itemID]._props.StackMaxSize;
    }
    getItemInHandbook(itemID) {
        try {
            return this.handbook.Items.find((i) => i.Id === itemID); // Outs: @Id, @ParentId, @Price
        }
        catch (error) {
            log(error);
        }
    }
    resolveBestTrader(itemID, locale = "en") {
        let traderMulti = 0; // AVG fallback
        let traderName = "None";
        // let itemParentID = this.items[itemID]._parent // Unused
        let itemBaseClasses = this.itemBaseClassService.getItemBaseClasses(itemID);
        // log(itemBaseClasses)
        // let handbookCategories = handbook.Categories.filter((i) => i.Id === handbookParentId)[0]
        // traderSellCategory = handbookCategories?.Id // "?" check is for shitty custom items
        // altTraderSellCategory = handbookCategories?.ParentId
        for (const trader of this.traderList) {
            if ((trader.base.items_buy.category.some((x) => itemBaseClasses.includes(x)) || trader.base.items_buy.id_list.includes(itemID)) &&
                !trader.base.items_buy_prohibited.id_list.includes(itemID)) {
                // items_buy is new to 350 it seems
                traderMulti = (100 - trader.base.loyaltyLevels[0].buy_price_coef) / 100;
                //traderName = traderList[i].base.nickname
                traderName = this.locales[locale][`${trader.base._id} Nickname`];
                // log(`${this.getItemName(itemID)} @ ${traderName}`)
                return {
                    multi: traderMulti,
                    name: traderName,
                };
            }
        }
        return {
            multi: traderMulti,
            name: traderName,
        };
    }
    getItemBestTrader(itemID, locale = "en") {
        let handbookItem = this.getItemInHandbook(itemID);
        // log(handbookItem)
        let bestTrader = this.resolveBestTrader(itemID, locale);
        let result = handbookItem.Price * bestTrader.multi;
        return {
            price: result,
            name: bestTrader.name,
            ParentId: handbookItem.ParentId,
        };
    }
    getFleaPrice(itemID) {
        if (typeof this.fleaPrices[itemID] != "undefined") {
            // Forgot quotes, typeof returns string..
            return this.fleaPrices[itemID];
        }
        else {
            return this.getItemInHandbook(itemID).Price;
        }
    }
    getBestPrice(itemID) {
        if (typeof this.fleaPrices[itemID] != "undefined") {
            return this.fleaPrices[itemID];
        }
        else {
            return this.getItemBestTrader(itemID).price;
        }
    }
    bartersResolver(itemID) {
        let itemBarters = [];
        this.traderList.forEach((trader) => {
            const allTraderBarters = trader.assort.items;
            const traderBarters = allTraderBarters.filter((x) => x._tpl == itemID);
            const barters = traderBarters
                .map((barter) => recursion(barter)) // find and get list of "parent items" for a passed component
                .map((barter) => ({
                // reset parentItem for actual parent items because of recursion function.
                // can be done in a more elegant way, but i'm too tired after a night of debugging. who cares anyway, it works.
                parentItem: barter.originalItemId ? (barter.originalItemId == itemID ? null : barter.originalItemId) : null,
                barterResources: trader.assort.barter_scheme[barter._id][0],
                barterLoyaltyLevel: trader.assort.loyal_level_items[barter._id],
                traderID: trader.base._id,
            }));
            itemBarters.push(...barters);
            function recursion(barter) {
                if (barter.parentId == "hideout") {
                    return barter;
                }
                else {
                    let parentBarter;
                    try {
                        // spent literary 12 hours debugging this feature... KMP.
                        // all because of one item, SWORD International Mk-18 not having proper .parentId is assort table. who would have thought. thx Nikita
                        parentBarter = allTraderBarters.find((x) => x._id == barter.parentId);
                        parentBarter.originalItemID = parentBarter._tpl;
                    }
                    catch (error) {
                        return barter; // FML
                    }
                    return recursion(parentBarter);
                }
            }
        });
        return itemBarters;
    }
    barterInfoGenerator(itemBarters, locale = "en") {
        let barterString = "";
        let rarityArray = [];
        let prices = [];
        for (const barter of itemBarters) {
            let totalBarterPrice = 0;
            let totalBarterPriceString = "";
            let traderName = this.locales[locale][`${barter.traderID} Nickname`];
            let partOf = "";
            if (barter.parentItem != null) {
                partOf = ` ∈ ${this.getItemShortName(barter.parentItem, locale)}`;
            }
            barterString += `${translations_json_1.default[locale].Bought}${partOf} ${translations_json_1.default[locale].at} ${traderName} ${translations_json_1.default[locale].lv}${barter.barterLoyaltyLevel} < `;
            let isBarter = false;
            for (let resource of barter.barterResources) {
                if (resource._tpl == "5449016a4bdc2d6f028b456f") {
                    let rubles = resource.count;
                    barterString += `${this.formatPrice(Math.round(rubles))}₽ + `;
                }
                else if (resource._tpl == "569668774bdc2da2298b4568") {
                    let euro = resource.count;
                    barterString += `${this.formatPrice(Math.round(euro))}€ ≈ ${this.formatPrice(Math.round(this.euroRatio * euro))}₽ + `;
                }
                else if (resource._tpl == "5696686a4bdc2da3298b456a") {
                    let dollars = resource.count;
                    barterString += `$${this.formatPrice(Math.round(dollars))} ≈ ${this.formatPrice(Math.round(this.dollarRatio * dollars))}₽ + `;
                }
                else {
                    totalBarterPrice += this.getFleaPrice(resource._tpl) * resource.count;
                    barterString += this.getItemShortName(resource._tpl, locale);
                    barterString += ` ×${resource.count} + `;
                    isBarter = true;
                }
            }
            if (isBarter) {
                rarityArray.push(barter.barterLoyaltyLevel + 1);
            }
            else {
                rarityArray.push(barter.barterLoyaltyLevel);
            }
            if (totalBarterPrice != 0) {
                totalBarterPriceString = ` | Σ ≈ ${this.formatPrice(Math.round(totalBarterPrice))}₽`;
            }
            barterString = barterString.slice(0, barterString.length - 3) + totalBarterPriceString + "\n";
        }
        return {
            prices: prices,
            barters: barterString,
            rarity: rarityArray.length == 0 ? 0 : Math.min(...rarityArray),
        };
    }
    barterResourceInfoGenerator(itemID, locale = "en") {
        // Refactor this abomination pls
        let baseBarterString = "";
        for (const trader of this.traderList) {
            let traderName = this.locales[locale][`${trader.base._id} Nickname`];
            for (let barterID in trader.assort.barter_scheme) {
                // iterate all seller barters
                for (let srcs in trader.assort.barter_scheme[barterID][0]) {
                    if (trader.assort.barter_scheme[barterID][0][srcs]._tpl === itemID) {
                        let barterResources = trader.assort.barter_scheme[barterID][0];
                        let bartedForItem;
                        let totalBarterPrice = 0;
                        let barterLoyaltyLevel = trader.assort.loyal_level_items[barterID];
                        for (let originalBarter in trader.assort.items) {
                            if (trader.assort.items[originalBarter]._id == barterID) {
                                bartedForItem = trader.assort.items[originalBarter]._tpl;
                            }
                        }
                        baseBarterString += translations_json_1.default[locale].Traded + " ×" + trader.assort.barter_scheme[barterID][0][srcs].count + " ";
                        baseBarterString +=
                            translations_json_1.default[locale].at + " " + traderName + " " + translations_json_1.default[locale].lv + barterLoyaltyLevel + " > " + this.getItemName(bartedForItem, locale);
                        let extendedBarterString = " < … + ";
                        for (let barterResource in barterResources) {
                            totalBarterPrice += this.getFleaPrice(barterResources[barterResource]._tpl) * barterResources[barterResource].count;
                            if (barterResources[barterResource]._tpl != itemID) {
                                extendedBarterString += this.getItemShortName(barterResources[barterResource]._tpl, locale);
                                extendedBarterString += ` ×${barterResources[barterResource].count} + `;
                            }
                        }
                        const barterStringToAppend = totalBarterPrice != 0 ? ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(bartedForItem) - totalBarterPrice))}₽` : null;
                        extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3);
                        extendedBarterString += barterStringToAppend;
                        baseBarterString += extendedBarterString + newLine;
                    }
                }
            }
        }
        return baseBarterString;
    }
    getCraftingAreaName(areaType, locale = "en") {
        let stringName = `hideout_area_${areaType}_name`;
        return this.locales[locale][stringName];
    }
    getCraftingRarity(areaType, level) {
        for (let s in this.hideoutAreas[areaType].stages) {
            if (Number.parseInt(s) > 1) {
                return level + 1;
            }
            else {
                return 4;
            }
        }
    }
    productionGenarator(itemID, locale = "en") {
        let craftableString = "";
        let rarityArray = [];
        for (let recipeId in this.hideoutProduction) {
            if (itemID === this.hideoutProduction[recipeId].endProduct && this.hideoutProduction[recipeId].areaType !== 21) {
                // Find every recipe for itemid and don't use Christmas Tree crafts
                let recipe = this.hideoutProduction[recipeId];
                let componentsString = "";
                let recipeAreaString = this.getCraftingAreaName(recipe.areaType, locale);
                let totalRecipePrice = 0;
                let recipeDivision = "";
                let questReq = "";
                for (const requirement of recipe.requirements) {
                    if (requirement.type === "Area") {
                        recipeAreaString = this.getCraftingAreaName(requirement.areaType, locale) + " " + translations_json_1.default[locale].lv + requirement.requiredLevel;
                        rarityArray.push(this.getCraftingRarity(requirement.areaType, requirement.requiredLevel));
                    }
                    if (requirement.type === "Item") {
                        let craftComponentId = requirement.templateId;
                        let craftComponentCount = requirement.count;
                        let craftComponentPrice = this.getFleaPrice(craftComponentId);
                        componentsString += this.getItemShortName(craftComponentId, locale) + " ×" + craftComponentCount + " + ";
                        totalRecipePrice += craftComponentPrice * craftComponentCount;
                    }
                    if (requirement.type === "Resource") {
                        // superwater calculation
                        let craftComponentId = requirement.templateId;
                        let resourceProportion = requirement.resource / this.items[requirement.templateId]._props.Resource;
                        let craftComponentPrice = this.getFleaPrice(craftComponentId);
                        componentsString += this.getItemShortName(craftComponentId, locale) + " ×" + Math.round(resourceProportion * 100) + "%" + " + ";
                        totalRecipePrice += Math.round(craftComponentPrice * resourceProportion);
                    }
                    if (requirement.type === "QuestComplete") {
                        questReq = ` (${this.locales[locale][`${requirement.questId} name`]}✔)`;
                    }
                }
                if (recipe.count > 1) {
                    recipeDivision = " " + translations_json_1.default[locale].peritem;
                }
                componentsString = componentsString.slice(0, componentsString.length - 3);
                if (recipe.endProduct === "59faff1d86f7746c51718c9c") {
                    craftableString += `${translations_json_1.default[locale].Crafted} @ ${recipeAreaString}`;
                    const bitcoinTime = recipe.productionTime;
                    // prettier-ignore
                    craftableString += ` | 1× GPU: ${convertTime(gpuTime(1, bitcoinTime), locale)}, 10× GPU: ${convertTime(gpuTime(10, bitcoinTime), locale)}, 25× GPU: ${convertTime(gpuTime(25, bitcoinTime), locale)}, 50× GPU: ${convertTime(gpuTime(50, bitcoinTime), locale)}`;
                    // 					log(`
                    // // Base time (x${roundWithPrecision(145000/time, 2)}): ${convertTime(time)}, GPU Boost: x${roundWithPrecision(tables.hideout.settings.gpuBoostRate/0.041225, 2)}
                    // // 2× GPU: ${convertTime(gpuTime(2))} x${roundWithPrecision(time/gpuTime(2), 2)}
                    // // 10× GPU: ${convertTime(gpuTime(10))} x${roundWithPrecision(time/gpuTime(10), 2)}
                    // // 25× GPU: ${convertTime(gpuTime(25))} x${roundWithPrecision(time/gpuTime(25), 2)}
                    // // 50× GPU: ${convertTime(gpuTime(50))} x${roundWithPrecision(time/gpuTime(50), 2)}`)
                }
                else {
                    craftableString += `${translations_json_1.default[locale].Crafted} ×${recipe.count} @ ${recipeAreaString}${questReq} < `;
                    craftableString += `${componentsString} | Σ${recipeDivision} ≈ ${this.formatPrice(Math.round(totalRecipePrice / recipe.count))}₽\n`;
                }
                function convertTime(time, locale = "en") {
                    const hours = Math.trunc(time / 60 / 60);
                    const minutes = Math.round((time - hours * 60 * 60) / 60);
                    return `${hours}${ItemInfo.locales[locale].HOURS} ${minutes}${ItemInfo.locales[locale].Min}`;
                }
                function gpuTime(gpus, time) {
                    // return time / (1 + (gpus - 1) * this.tables.hideout.settings.gpuBoostRate)
                    return time / (1 + (gpus - 1) * 0.041225);
                }
                // if (fleaPrice > totalRecipePrice/recipe.count) {
                // 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
                // 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + this.GetItemName(id) + " can be crafted at " + recipeAreaString)
                // }
            }
        }
        return craftableString;
    }
    HideoutInfoGenerator(itemID, locale = "en") {
        // make it like this
        // const r = data.filter(d => d.courses.every(c => courses.includes(c.id)));
        let hideoutString = "";
        for (const area of this.hideoutAreas) {
            for (const stage in area.stages) {
                for (const requirement of area.stages[stage].requirements) {
                    if (requirement.templateId === itemID) {
                        hideoutString += `${translations_json_1.default[locale].Need} ×${requirement.count} > ${this.getCraftingAreaName(area.type, locale)} ${translations_json_1.default[locale].lv}${stage}\n`;
                    }
                }
            }
        }
        // console.log(hideoutString)
        return hideoutString;
    }
    CraftingMaterialInfoGenarator(itemID, locale = "en") {
        let usedForCraftingString = "";
        // let totalCraftingPrice = 0 // Unused
        for (const recipe of this.hideoutProduction) {
            for (let s in recipe.requirements) {
                if (recipe.requirements[s].templateId === itemID) {
                    let usedForCraftingComponentsString = " < … + ";
                    let recipeAreaString = "";
                    let totalRecipePrice = 0;
                    let questReq = "";
                    for (const requirement of recipe.requirements) {
                        if (requirement.type == "Area") {
                            // prettier-ignore
                            recipeAreaString = this.getCraftingAreaName(requirement.areaType, locale) + " " + translations_json_1.default[locale].lv + requirement.requiredLevel;
                        }
                        if (requirement.type == "Item") {
                            let craftComponent = requirement;
                            if (craftComponent.templateId != itemID) {
                                usedForCraftingComponentsString += this.getItemShortName(craftComponent.templateId, locale) + " ×" + craftComponent.count + " + ";
                            }
                            totalRecipePrice += this.getFleaPrice(craftComponent.templateId) * craftComponent.count;
                        }
                        if (requirement.type == "Resource") {
                            let craftComponent = requirement;
                            let resourceProportion = craftComponent.resource / this.items[craftComponent.templateId]._props.Resource;
                            if (craftComponent.templateId != itemID) {
                                usedForCraftingComponentsString +=
                                    this.getItemShortName(craftComponent.templateId, locale) + " ×" + Math.round(resourceProportion * 100) + "%" + " + ";
                            }
                            totalRecipePrice += Math.round(this.getFleaPrice(craftComponent.templateId) * resourceProportion);
                        }
                        if (requirement.type === "QuestComplete") {
                            questReq = ` (${this.locales[locale][`${requirement.questId} name`]}✔) `;
                        }
                    }
                    usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3);
                    // prettier-ignore
                    usedForCraftingComponentsString += ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(recipe.endProduct) * recipe.count - totalRecipePrice))}₽`;
                    // prettier-ignore
                    usedForCraftingString += `${recipe.requirements[s].type == "Tool" ? translations_json_1.default[locale].Tool : translations_json_1.default[locale].Part + " ×" + recipe.requirements[s].count} > ${this.getItemName(recipe.endProduct, locale)} ×${recipe.count}`;
                    usedForCraftingString += ` @ ${recipeAreaString + questReq + usedForCraftingComponentsString}\n`;
                }
            }
        }
        // console.log(hideoutString)
        // log (usedForCraftingString)
        return usedForCraftingString;
    }
    QuestInfoGenerator(itemID, locale = "en") {
        let questString = "";
        for (const questID in this.quests) {
            let questName = this.locales[locale][`${questID} name`];
            let questConditions = this.quests[questID].conditions.AvailableForFinish;
            for (const condition of questConditions) {
                if (condition._parent == "HandoverItem" && condition._props.target[0] == itemID) {
                    let trader = this.quests[questID].traderId;
                    //let tradeName = tables.traders[trader].base.nickname
                    let traderName = this.locales[locale][`${trader} Nickname`];
                    // prettier-ignore
                    questString += `${translations_json_1.default[locale].Found} ${condition._props.onlyFoundInRaid ? "(✔) " : ""}×${condition._props.value} > ${questName} @ ${traderName}\n`;
                }
            }
        }
        return questString;
    }
}
function roundWithPrecision(num, precision) {
    const multiplier = Math.pow(10, precision);
    return Math.round(num * multiplier) / multiplier;
}
const log = (i) => {
    // for my sanity and convenience
    console.log(i);
};
module.exports = { mod: new ItemInfo() };
