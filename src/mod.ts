import { DependencyContainer } from "tsyringe"

import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

import translations from "./translations.json"
import config from "../config/config.json"

// Abandon hope, all ye who enter here...
let database
let tables
let items
let handbook
let logger
let locales
let clientItems
let fleaPrices
let hideoutProduction
let hideoutAreas
let quests
let armors

let therapist
let ragman
let jaeger
let mechanic
let prapor
let peacekeeper
let skier
let fence
let traderList

// ^ PLS, somebody explain to me (I'm NOT a programmer btw) how not to use a bajillion "this.*" for EVERY variable in a class to write PROPER (sic) code. This can't be sane, I just refuse.

const euroRatio = 118 // TODO: remove hardcode
const dollarRatio = 114

const newLine = "\n"

class ItemInfo implements IPostDBLoadMod {
	init(container: DependencyContainer) {
		// logger = container.resolve<ILogger>("WinstonLogger") // meh...
		database = container.resolve<DatabaseServer>("DatabaseServer")
		tables = database.getTables()
		items = tables.templates.items
		handbook = tables.templates.handbook
		locales = tables.locales.global
		clientItems = tables.templates.clientItems.data
		fleaPrices = tables.templates.prices
		hideoutProduction = tables.hideout.production
		hideoutAreas = tables.hideout.areas
		quests = tables.templates.quests
		armors = tables.globals.config.ArmorMaterials

		therapist = tables.traders["54cb57776803fa99248b456e"]
		ragman = tables.traders["5ac3b934156ae10c4430e83c"]
		jaeger = tables.traders["5c0647fdd443bc2504c2d371"]
		mechanic = tables.traders["5a7c2eca46aef81a7ca2145d"]
		prapor = tables.traders["54cb50c76803fa8b248b4571"]
		peacekeeper = tables.traders["5935c25fb3acc3127c3d8cd9"]
		skier = tables.traders["58330581ace78e27b8b10cee"]
		fence = tables.traders["579dc571d53a0658a154fbec"]
		traderList = [therapist, ragman, jaeger, mechanic, prapor, peacekeeper, skier, fence]
	}

	public postDBLoad(container: DependencyContainer) {
		this.init(container)

		for (const itemID in items) {
			const item = items[itemID]
			const itemInHandbook = this.getItemInHandbook(itemID)
			item._props.ExaminedByDefault = true // DEBUG!!!!
			if (
				item._type === "Item" && // Check if the item is a real item and not a "node" type.
				itemInHandbook != undefined && // Ignore "useless" items
				item._props.QuestItem != true && // Ignore quest items.
				item._parent != "543be5dd4bdc2deb348b4569" // Ignore currencies.
			) {
				let name = this.getItemName(itemID) // for debug only
				// boilerplate defaults
				let descriptionString = ""
				let priceString = ""
				let barterString = ""
				let productionString = ""
				let usedForBarterString = ""
				let usedForQuestsString = ""
				let usedForHideoutString = ""
				let usedForCraftingString = ""
				let armorDurabilityString = ""
				let spawnChanceString = ""
				let slotEffeciencyString = ""
				let headsetDescription = ""
				let tier = ""
				let itemRarity = 0
				let spawnString = ""

				let fleaPrice = this.getFleaPrice(itemID)
				let itemBestVendor = this.getItemBestTrader(itemID)
				let traderPrice = Math.round(itemBestVendor.price)
				let traderName = itemBestVendor.name

				let spawnChance = clientItems[itemID]?._props?.SpawnChance

				let slotDensity = this.getItemSlotDensity(itemID)

				let itemBarters = this.bartersResolver(itemID)
				let barterInfo = this.barterInfoGenerator(itemBarters)
				let barterResourceInfo = this.barterResourceInfoGenerator(itemID)
				let rarityArray = []
				rarityArray.push(barterInfo.rarity) // futureprofing, add other rarity calculations
				itemRarity = Math.min(...rarityArray)

				if (item._props.CanSellOnRagfair === false && item._id != "56d59d3ad2720bdb418b4577" && itemRarity == 0) {
					fleaPrice = "BANNED"
					itemRarity = 7
				}

				let itemRarityFallback = ""
				if (itemRarity == 0 && clientItems[itemID]?._props?.Rarity !== undefined) {
					itemRarityFallback = clientItems[itemID]._props.Rarity
				}

				if (item._parent == "543be5cb4bdc2deb348b4568") {
					// Ammo boxes special case
					let count = item._props.StackSlots[0]._max_count
					let ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]

					let value = this.getItemBestTrader(ammo).price
					traderPrice = value * count
					if (itemRarity == 0) {
						itemRarity = this.barterInfoGenerator(this.bartersResolver(ammo)).rarity
					}
				}

				if (config.BulletStatsInName.enabled == true) {
					if (item._props.ammoType === "bullet" || item._props.ammoType === "buckshot") {
						let damageMult = 1
						if (item._props.ammoType === "buckshot") {
							damageMult = item._props.buckshotBullets
						}
						this.addToName(itemID, ` (${item._props.Damage * damageMult}/${item._props.PenetrationPower})`, "append")
					}
				}

				if (config.SpawnInfo.enabled) {
					if (spawnChance > 0) {
						spawnString += `Spawn chance: ${spawnChance}%` + newLine + newLine
					}
				}

				if (config.FleaAbusePatch.enabled) {
					if (fleaPrice * 0.8 < traderPrice) {
						// TODO: get flea min price (default 0.8) from actual config
						// log(name)
						let fleaPriceFix = Math.round(traderPrice * (1 / 0.8 + 0.01))
						fleaPrices[itemID] = fleaPriceFix
						fleaPrice = fleaPriceFix
					}
				}

				if (config.RarityRecolor.enabled) {
					item._props.BackgroundColor = "grey"

					for (const customItem in config.RarityRecolor.customRarity) {
						if (customItem == itemID) {
							itemRarity = config.RarityRecolor.customRarity[customItem]
						}
					}

					if (itemRarity == 7) {
						tier = "OVERPOWERED"
						item._props.BackgroundColor = "tracerRed"
					} else if (itemRarity == 1) {
						tier = "COMMON"
						item._props.BackgroundColor = "default"
					} else if (itemRarity == 2) {
						tier = "RARE"
						item._props.BackgroundColor = "blue"
					} else if (itemRarity == 3) {
						tier = "EPIC"
						item._props.BackgroundColor = "violet"
					} else if (itemRarity == 4) {
						tier = "LEGENDARY"
						item._props.BackgroundColor = "yellow"
					} else if (itemRarity == 5) {
						tier = "UBER"
						item._props.BackgroundColor = "tracerYellow"
					} else if (spawnChance < 2 || itemRarity == 6) {
						// 6 is for custom rules only
						tier = "UNOBTAINIUM"
						item._props.BackgroundColor = "tracerGreen"
						// log(name)
					} else if (itemRarity == 8) {
						// 8 is for custom dim red background
						tier = "CUSTOM"
						item._props.BackgroundColor = "red"
					} else if (itemRarityFallback.includes("Common")) {
						tier = "COMMON"
						item._props.BackgroundColor = "default"
					} else if (itemRarityFallback.includes("Rare")) {
						tier = "RARE"
						item._props.BackgroundColor = "blue"
					} else if (itemRarityFallback.includes("Superrare")) {
						tier = "EPIC"
						item._props.BackgroundColor = "violet"
					} else if (itemRarityFallback == "Not_exist") {
						tier = "LEGENDARY"
						item._props.BackgroundColor = "yellow"
						// log(name)
					} else {
						// everything else that falls in here
						tier = "UNKNOWN"
						item._props.BackgroundColor = "green"
					}

					if (config.RarityRecolor.addTierNameToPricesInfo) {
						if (tier.length > 0) {
							priceString += tier + " | "
						}
					}
				}

				if (config.ArmorInfo.enabled) {
					if (item._props.armorClass > 0) {
						let armor = armors[item._props.ArmorMaterial]
						// prettier-ignore
						armorDurabilityString += `${config.ArmorInfo.addArmorClassInfo ? "Armor class: " + item._props.armorClass + " | " : ""}Effective durability: ${Math.round(item._props.MaxDurability / armor.Destructibility)} (Max: ${item._props.MaxDurability} x ${item._props.ArmorMaterial}: ${roundWithPrecision(1 / armor.Destructibility, 1)}) | Repair degradation: ${Math.round(armor.MinRepairDegradation * 100)}% - ${Math.round(armor.MaxRepairDegradation * 100)}%` + newLine + newLine
					}
				}

				if (config.ContainerInfo.enabled) {
					if (item._props.Grids?.length > 0) {
						let totalSlots = 0

						for (const grid of item._props.Grids) {
							totalSlots += grid._props.cellsH * grid._props.cellsV
						}

						let slotEffeciency = roundWithPrecision(totalSlots / (item._props.Width * item._props.Height), 2)
						slotEffeciencyString += `Slot effeciency: ×${slotEffeciency} (${totalSlots}/${item._props.Width * item._props.Height})` + newLine + newLine
					}
				}

				if (config.MarkValueableItems.enabled) {
					let itemvalue = traderPrice / slotDensity
					let fleaValue = fleaPrice / slotDensity
					if (items[itemID]._parent != "5795f317245977243854e041") {
						if (itemvalue > config.MarkValueableItems.traderSlotValueThresholdBest || fleaValue > config.MarkValueableItems.fleaSlotValueThresholdBest) {
							if (config.MarkValueableItems.addToShortName) {
								this.addToShortName(itemID, "★", "prepend")
							}
							if (config.MarkValueableItems.addToName) {
								this.addToName(itemID, "★", "append")
							}
						} else if (itemvalue > config.MarkValueableItems.traderSlotValueThresholdGood || fleaValue > config.MarkValueableItems.fleaSlotValueThresholdGood) {
							if (config.MarkValueableItems.addToShortName) {
								this.addToShortName(itemID, "☆", "prepend")
							}
							if (config.MarkValueableItems.addToName) {
								this.addToName(itemID, "☆", "append")
							}
						}
					}
				}

				if (config.PricesInfo.enabled) {
					priceString += `Flea price: ${fleaPrice}₽ | ${traderName}'s valuation: ${traderPrice}₽` + newLine + newLine
				}

				if (config.HeadsetInfo.enabled) {
					if (item._props.Distortion !== undefined) {
						let gain = item._props.CompressorGain
						let thresh = item._props.CompressorTreshold
						// prettier-ignore
						headsetDescription = `Ambient Volume: ${item._props.AmbientVolume}dB | Compressor: Gain ${gain}dB × Treshold ${thresh}dB ≈ ×${Math.abs((gain * thresh) / 100)} Boost | Resonance & Filter: ${item._props.Resonance}@${item._props.CutoffFreq}Hz | Distortion: ${Math.round(item._props.Distortion * 100)}%` + newLine + newLine
						// log(name)
						// log(headsetDescription)
					}
				}

				if (config.BarterInfo.enabled) {
					if (barterInfo.barters.length > 1) {
						barterString = barterInfo.barters + newLine
						// log(barterString)
					}
				}

				if (config.ProductionInfo.enabled) {
					if (this.productionGenarator(itemID).length > 1) {
						productionString = this.productionGenarator(itemID) + newLine
						// log(productionString)
					}
				}

				if (config.BarterResourceInfo.enabled) {
					if (barterResourceInfo.string.length > 1) {
						usedForBarterString = barterResourceInfo.string + newLine
						// log(name)
						// log(usedForBarterString)
					}
				}

				if (config.QuestInfo.enabled) {
					const itemQuestInfo = this.QuestInfoGenerator(itemID)
					if (itemQuestInfo.length > 1) {
						usedForQuestsString = itemQuestInfo + newLine
						// item._props.BackgroundColor = "tracerGreen"
						if (config.QuestInfo.FIRinName && itemQuestInfo.includes("✔")) {
							this.addToName(itemID, "✔", "append")
							this.addToShortName(itemID, "", "prepend") // ✔ is not shown in inventory icon font :(
						}
						// log(this.getItemName(itemID))
						// log(usedForQuestsString)
					}
				}

				if (config.HideoutInfo.enabled) {
					const itemHideoutInfo = this.HideoutInfoGenerator(itemID)
					if (itemHideoutInfo.length > 1) {
						usedForHideoutString = itemHideoutInfo + newLine
						// log(name)
						// log(usedForHideoutString)
					}
				}

				if (config.CraftingMaterialInfo.enabled) {
					const itemCraftingMaterialInfo = this.CraftingMaterialInfoGenarator(itemID)
					if (itemCraftingMaterialInfo.length > 1) {
						usedForCraftingString = itemCraftingMaterialInfo + newLine
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
					slotEffeciencyString +
					usedForQuestsString +
					usedForHideoutString +
					barterString +
					productionString +
					usedForCraftingString +
					usedForBarterString

				this.addToDescription(itemID, descriptionString, "prepend")

				const debug = false
				if (debug) {
					log(this.getItemName(itemID))
					log(this.getItemDescription(itemID))
					log(`---`)
				}

				// this.addToName(itemID, "✅✓✔☑🗸⍻√❎❌✖✗✘☒", "append");
			}
		}
	}

	getItemName(itemID, locale = "en") {
		return locales[locale][`${itemID} Name`]
	}

	getItemShortName(itemID, locale = "en") {
		return locales[locale][`${itemID} ShortName`]
	}

	getItemDescription(itemID, locale = "en") {
		return locales[locale][`${itemID} Description`]
	}

	addToName(itemID, addToName, place, lang = "") {
		if (lang == "") {
			// I'm actually really proud of this one! If no lang argument is passed, it defaults to recursion for all languages.
			for (const locale in locales) {
				this.addToName(itemID, addToName, place, locale)
			}
		} else {
			let originalName = locales[lang][`${itemID} Name`]
			switch (place) {
				case "prepend":
					locales[lang][`${itemID} Name`] = addToName + originalName
					break
				case "append":
					locales[lang][`${itemID} Name`] = originalName + addToName
					break
			}
		}
	}

	addToShortName(itemID, addToShortName, place, lang = "") {
		if (lang == "") {
			for (const locale in locales) {
				this.addToShortName(itemID, addToShortName, place, locale)
			}
		} else {
			let originalShortName = locales[lang][`${itemID} ShortName`]
			switch (place) {
				case "prepend":
					locales[lang][`${itemID} ShortName`] = addToShortName + originalShortName
					break
				case "append":
					locales[lang][`${itemID} ShortName`] = originalShortName + addToShortName
					break
			}
		}
	}

	addToDescription(itemID, addToDescription, place, lang = "") {
		if (lang == "") {
			for (const locale in locales) {
				this.addToDescription(itemID, addToDescription, place, locale)
			}
		} else {
			let originalDescription = locales[lang][`${itemID} Description`]
			switch (place) {
				case "prepend":
					locales[lang][`${itemID} Description`] = addToDescription + originalDescription
					break
				case "append":
					locales[lang][`${itemID} Description`] = originalDescription + addToDescription
					break
			}
		}
	}

	getItemSlotDensity(itemID) {
		return (items[itemID]._props.Width * items[itemID]._props.Height) / items[itemID]._props.StackMaxSize
	}

	getItemInHandbook(itemID) {
		return handbook.Items.filter((i) => i.Id === itemID)[0] // Outs: @Id, @ParentId, @Price
	}

	resolveBestTrader(handbookParentId) {
		// I stole this code from someone looong ago, can't remember where, PM me to give proper credit
		let traderSellCategory = ""
		let traderMulti = 0.54 // AVG fallback
		let altTraderSellCategory = ""
		let traderName = ""

		let handbookCategories = handbook.Categories.filter((i) => i.Id === handbookParentId)[0]

		traderSellCategory = handbookCategories.Id
		altTraderSellCategory = handbookCategories.ParentId

		for (let i = 0; i < 8; i++) {
			if (traderList[i].base.sell_category.includes(traderSellCategory) || traderList[i].base.sell_category.includes(altTraderSellCategory)) {
				traderMulti = (100 - traderList[i].base.loyaltyLevels[0].buy_price_coef) / 100
				traderName = traderList[i].base.nickname
				return {
					multi: traderMulti,
					name: traderName,
				}
			}
		}
		return traderMulti
	}

	getItemBestTrader(itemID) {
		let itemBasePrice = 1

		let handbookItem = this.getItemInHandbook(itemID)
		let bestTrader = this.resolveBestTrader(handbookItem.ParentId)
		let result = handbookItem.Price * bestTrader.multi
		return {
			price: result,
			name: bestTrader.name,
			ParentId: handbookItem.ParentId,
		}
	}

	getFleaPrice(itemID) {
		if (typeof fleaPrices[itemID] != "undefined") {
			return fleaPrices[itemID]
		} else {
			return this.getItemBestTrader(itemID).price
		}
	}

	bartersResolver(itemID) {
		let itemBarters = []

		for (
			let trader = 0;
			trader < 7;
			trader++ // iterate excluding Fence sales.
		) {
			for (const barter of traderList[trader].assort.items) {
				if (barter._tpl == itemID && barter.parentId === "hideout") {
					const barterResources = traderList[trader].assort.barter_scheme[barter._id][0]
					const barterLoyaltyLevel = traderList[trader].assort.loyal_level_items[barter._id]
					const traderID = traderList[trader].base._id
					itemBarters.push({ traderID, barterLoyaltyLevel, barterResources })
				} /* else if (barter._tpl == itemID && barter.parentId != "hideout") {
					let rec = (b) => {
						let x = traderList[trader].assort.items.filter((x) => x._id == b)

						if (x.length > 0) {
							if (x[0].parentId != "hideout") {
								rec(x[0].parentId)
							} else {
								this.bartersResolver(x[0]._tpl) // I need help resolving this recursion for unbuyable items in weapon presets, it seems to work, but not really. feel dumb
							}
						}
					}
					// log(barter)
					rec(barter.parentId) 
				}*/
			}
		}
		return itemBarters
	}

	barterInfoGenerator(itemBarters, locale = "en") {
		let barterString = ""
		let rarityArray = []
		let prices = []
		for (const barter of itemBarters) {
			let totalBarterPrice = 0
			let totalBarterPriceString = ""
			let traderName = locales[locale][`${barter.traderID} Nickname`]
			barterString += `${translations[locale].Bought} ${translations[locale].at} ${traderName} ${translations[locale].lv}${barter.barterLoyaltyLevel} < `
			let isBarter = false
			for (let resource of barter.barterResources) {
				if (resource._tpl == "5449016a4bdc2d6f028b456f") {
					let rubles = resource.count
					barterString += `${Math.round(rubles)}₽ + `
				} else if (resource._tpl == "569668774bdc2da2298b4568") {
					let euro = resource.count
					barterString += `${Math.round(euro)}€ ≈ ${Math.round(euroRatio * euro)}₽ + `
				} else if (resource._tpl == "5696686a4bdc2da3298b456a") {
					let dollars = resource.count
					barterString += `$${Math.round(dollars)} ≈ ${Math.round(dollarRatio * dollars)}₽ + `
				} else {
					totalBarterPrice += this.getFleaPrice(resource._tpl) * resource.count
					barterString += this.getItemShortName(resource._tpl, locale)
					barterString += ` ×${resource.count} + `
					isBarter = true
				}
			}
			if (isBarter) {
				rarityArray.push(barter.barterLoyaltyLevel + 1)
			} else {
				rarityArray.push(barter.barterLoyaltyLevel)
			}
			if (totalBarterPrice != 0) {
				totalBarterPriceString = ` | Σ ≈ ${Math.round(totalBarterPrice)}₽`
			}
			barterString = barterString.slice(0, barterString.length - 3) + totalBarterPriceString + "\n"
		}
		return {
			prices: prices, //TODO
			barters: barterString,
			rarity: rarityArray.length == 0 ? 0 : Math.min(...rarityArray),
		}
	}

	barterResourceInfoGenerator(itemID, addExtendedString = true) {
		// Refactor this abomination pls
		let baseBarterString = ""
		let rarityArray = []
		for (
			let trader = 0;
			trader < 7;
			trader++ // iterate excluding Fence sales.
		) {
			for (let barterID in traderList[trader].assort.barter_scheme) {
				// iterate all seller barters
				for (let srcs in traderList[trader].assort.barter_scheme[barterID][0]) {
					if (traderList[trader].assort.barter_scheme[barterID][0][srcs]._tpl == itemID) {
						let barterResources = traderList[trader].assort.barter_scheme[barterID][0]
						let bartedForItem
						let totalBarterPrice = 0

						let barterLoyaltyLevel = traderList[trader].assort.loyal_level_items[barterID]
						for (let originalBarter in traderList[trader].assort.items) {
							if (traderList[trader].assort.items[originalBarter]._id == barterID) {
								bartedForItem = traderList[trader].assort.items[originalBarter]._tpl
							}
						}
						rarityArray.push(barterLoyaltyLevel + 1)
						baseBarterString += `Traded ×${traderList[trader].assort.barter_scheme[barterID][0][srcs].count}`
						baseBarterString += ` @ ${traderList[trader].base.nickname} lv.${barterLoyaltyLevel} > ${this.getItemName(bartedForItem)}`

						let extendedBarterString = " < … + "
						for (let barterResource in barterResources) {
							totalBarterPrice += this.getFleaPrice(barterResources[barterResource]._tpl) * barterResources[barterResource].count
							if (barterResources[barterResource]._tpl != itemID) {
								extendedBarterString += this.getItemShortName(barterResources[barterResource]._tpl)
								extendedBarterString += ` ×${barterResources[barterResource].count} + `
							}
						}
						if (totalBarterPrice != 0) {
							totalBarterPrice = ` | Δ ≈ ${Math.round(this.getFleaPrice(bartedForItem) - totalBarterPrice)}₽`
						} else {
							totalBarterPrice = ""
						}
						extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3)
						extendedBarterString += totalBarterPrice
						if (addExtendedString == false) {
							extendedBarterString = ""
						}
						baseBarterString += extendedBarterString + "\n"
					}
				}
			}
		}
		return {
			string: baseBarterString,
			rarity: rarityArray.length == 0 ? 0 : Math.min(...rarityArray),
		}
	}

	getCraftingAreaName(areaType, locale = "en") {
		let stringName = `hideout_area_${areaType}_name`
		return locales[locale][stringName]
	}

	getCraftingRarity(areaType, Level) {
		for (let s in hideoutAreas[areaType].stages) {
			if (s > 1) {
				return Level + 1
			} else {
				return 4
			}
		}
	}

	productionGenarator(itemID) {
		let craftableString = ""
		let rarityArray = []
		for (let recipeId in hideoutProduction) {
			if (itemID === hideoutProduction[recipeId].endProduct && hideoutProduction[recipeId].areaType != "21") {
				// Find every recipe for itemid and don't use Christmas Tree crafts
				let recipe = hideoutProduction[recipeId]
				let componentsString = ""
				let recipeAreaString = this.getCraftingAreaName(recipe.areaType)
				let totalRecipePrice = 0
				let recipeDivision = ""

				for (
					let i = recipe.requirements.length - 1;
					i >= 0;
					i-- // Itterate
				) {
					if (recipe.requirements[i].type === "Area") {
						let recipeArea = recipe.requirements[i] // Find and save craft area object
						recipeAreaString = this.getCraftingAreaName(recipeArea.areaType) + " lv." + recipeArea.requiredLevel
						rarityArray.push(this.getCraftingRarity(recipeArea.areaType, recipeArea.requiredLevel))
					}
					if (recipe.requirements[i].type === "Item") {
						let craftComponentId = recipe.requirements[i].templateId
						let craftComponentCount = recipe.requirements[i].count
						let craftComponentPrice = this.getFleaPrice(craftComponentId)

						componentsString += this.getItemShortName(craftComponentId) + " ×" + craftComponentCount + " + "
						totalRecipePrice += craftComponentPrice * craftComponentCount
					}
					if (recipe.requirements[i].type === "Resource") {
						// superwater calculation
						let craftComponentId = recipe.requirements[i].templateId
						let resourceProportion = recipe.requirements[i].resource / items[recipe.requirements[i].templateId]._props.Resource
						let craftComponentPrice = this.getFleaPrice(craftComponentId)

						componentsString += this.getItemShortName(craftComponentId) + " ×" + Math.round(resourceProportion * 100) + "%" + " + "
						totalRecipePrice += Math.round(craftComponentPrice * resourceProportion)
					} // add case for Bitcoin farm calculation.
				}
				if (recipe.count > 1) {
					recipeDivision = " per item"
				}
				componentsString = componentsString.slice(0, componentsString.length - 3)
				craftableString += `Crafted ×${recipe.count} @ ${recipeAreaString} < `
				craftableString += `${componentsString} | Σ${recipeDivision} ≈ ${Math.round(totalRecipePrice / recipe.count)}₽\n`

				// if (fleaPrice > totalRecipePrice/recipe.count) {
				// 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
				// 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + this.GetItemName(id) + " can be crafted at " + recipeAreaString)
				// }
			}
		}
		return craftableString
	}

	HideoutInfoGenerator(itemID) {
		// make it like this
		// const r = data.filter(d => d.courses.every(c => courses.includes(c.id)));

		let hideoutString = ""
		for (let area in hideoutAreas) {
			for (let s in hideoutAreas[area].stages) {
				for (let a in hideoutAreas[area].stages[s].requirements) {
					if (hideoutAreas[area].stages[s].requirements[a].templateId == itemID) {
						hideoutString += `Need ×${hideoutAreas[area].stages[s].requirements[a].count} > ${this.getCraftingAreaName(hideoutAreas[area].type)} lv.${s}\n`
					}
				}
			}
		}
		// console.log(hideoutString)
		return hideoutString
	}

	CraftingMaterialInfoGenarator(itemID) {
		let usedForCraftingString = ""
		let totalCraftingPrice = 0

		for (let craftID in hideoutProduction) {
			for (let s in hideoutProduction[craftID].requirements) {
				if (hideoutProduction[craftID].requirements[s].templateId == itemID) {
					let usedForCraftingComponentsString = " < … + "
					let recipeAreaString = ""
					let totalRecipePrice = 0
					for (
						let i = hideoutProduction[craftID].requirements.length - 1;
						i >= 0;
						i-- // Itterate
					) {
						if (hideoutProduction[craftID].requirements[i].type == "Area") {
							// prettier-ignore
							recipeAreaString = this.getCraftingAreaName(hideoutProduction[craftID].requirements[i].areaType) +" lv." +hideoutProduction[craftID].requirements[i].requiredLevel
						}
						if (hideoutProduction[craftID].requirements[i].type == "Item") {
							let craftComponent = hideoutProduction[craftID].requirements[i]
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString += this.getItemShortName(craftComponent.templateId) + " ×" + craftComponent.count + " + "
							}
							totalRecipePrice += this.getFleaPrice(craftComponent.templateId) * craftComponent.count
						}
						if (hideoutProduction[craftID].requirements[i].type == "Resource") {
							let craftComponent = hideoutProduction[craftID].requirements[i]
							let resourceProportion = craftComponent.resource / items[craftComponent.templateId]._props.Resource
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString += this.getItemShortName(craftComponent.templateId) + " ×" + Math.round(resourceProportion * 100) + "%" + " + "
							}
							totalRecipePrice += Math.round(this.getFleaPrice(craftComponent.templateId) * resourceProportion)
						}
					}
					usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3)
					// prettier-ignore
					usedForCraftingComponentsString += ` | Δ ≈ ${Math.round(this.getFleaPrice(hideoutProduction[craftID].endProduct) * hideoutProduction[craftID].count - totalRecipePrice)}₽`
					// prettier-ignore
					usedForCraftingString += `${hideoutProduction[craftID].requirements[s].type == "Tool" ? "Tool" : "Part ×" + hideoutProduction[craftID].requirements[s].count} > ${this.getItemName(hideoutProduction[craftID].endProduct)} ×${hideoutProduction[craftID].count}`
					usedForCraftingString += ` @ ${recipeAreaString + usedForCraftingComponentsString}\n`
				}
			}
		}
		// console.log(hideoutString)
		// log (usedForCraftingString)
		return usedForCraftingString
	}

	QuestInfoGenerator(itemID) {
		let questString = ""
		for (let questID in quests) {
			let questConditions = quests[questID].conditions.AvailableForFinish
			for (let i in questConditions) {
				if (questConditions[i]._parent == "HandoverItem" && questConditions[i]._props.target[0] == itemID) {
					let trader = quests[questID].traderId
					// prettier-ignore
					questString += `Found ${questConditions[i]._props.onlyFoundInRaid ? "(✔) " : ""}×${questConditions[i]._props.value} > ${quests[questID].QuestName} @ ${tables.traders[trader].base.nickname}\n`
				}
			}
		}
		return questString
	}
}

function roundWithPrecision(num, precision) {
	var multiplier = Math.pow(10, precision)
	return Math.round(num * multiplier) / multiplier
}

const log = (i) => {
	// for my sanity and convenience
	console.log(i)
}

module.exports = { mod: new ItemInfo() }
