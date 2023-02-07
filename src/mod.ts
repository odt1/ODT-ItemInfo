import { DependencyContainer } from "tsyringe"

import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor"
import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor"
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ConfigServer } from "@spt-aki/servers/ConfigServer"
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes"

import translations from "./translations.json"
import config from "../config/config.json"
import tiers from "../config/tiers.json"

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

let ragfairConfig
let hideoutConfig

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

const BSGblacklist = [
	"59faff1d86f7746c51718c9c", // Physical bitcoin
	"5df8a6a186f77412640e2e80", // Christmas tree ornament (Red)
	"5df8a72c86f77412640e2e83", // Christmas tree ornament (Silver)
	"5df8a77486f77412672a1e3f", // Christmas tree ornament (Violet)
	"59f32bb586f774757e1e8442", // Dogtag BEAR
	"59f32c3b86f77472a31742f0", // Dogtag USEC
	"619bc61e86e01e16f839a999", // Alpha armband
	"619bddc6c9546643a67df6ee", // DEADSKUL armband
	"619bddffc9546643a67df6f0", // Train Hard armband
	"619bde3dc9546643a67df6f2", // Kiba Arms armband
	"619bdeb986e01e16f839a99e", // RFARMY armband
	"619bdf9cc9546643a67df6f8", // UNTAR armband
	"5ab8e79e86f7742d8b372e78", // BNTI Gzhel-K body armor
	"545cdb794bdc2d3a198b456a", // 6B43 6A Zabralo-Sh body armor
	"5c0e541586f7747fa54205c9", // 6B13 M modified assault armor (Tan)
	"5fd4c474dd870108a754b241", // 5.11 Tactical Hexgrid plate carrier
	"60a283193cb70855c43a381d", // NFM THOR Integrated Carrier body armor
	"5e9dacf986f774054d6b89f4", // FORT Defender-2 body armor
	"5b44cd8b86f774503d30cba2", // IOTV Gen4 body armor (full protection)
	"5b44cf1486f77431723e3d05", // IOTV Gen4 body armor (assault kit)
	"5b44d0de86f774503d30cba8", // IOTV Gen4 body armor (high mobility kit)
	"5f5f41476bdad616ad46d631", // NPP KlASS Korund-VM body armor
	"5ca2151486f774244a3b8d30", // FORT Redut-M body armor
	"5ca21c6986f77479963115a7", // FORT Redut-T5 body armor
	"5e4abb5086f77406975c9342", // LBT-6094A Slick Plate Carrier
	"6038b4ca92ec1c3103795a0d", // LBT-6094A Slick Plate Carrier (Olive)
	"6038b4b292ec1c3103795a0b", // LBT-6094A Slick Plate Carrier (Tan)
	"5c0e625a86f7742d77340f62", // BNTI Zhuk-6a body armor
	"62963c18dbc8ab5f0d382d0b", // Death Knight mask
	"62a61bbf8ec41a51b34758d2", // Big Pipe's smoking pipe
	"60a7ad3a0c5cb24b0134664a", // Tagilla's welding mask "Gorilla"
	"60a7ad2a2198820d95707a2e", // Tagilla's welding mask "UBEY"
	"5f60c74e3b85f6263c145586", // Rys-T bulletproof helmet
	"5a154d5cfcdbcb001a3b00da", // Ops-Core FAST MT Super High Cut helmet (Black)
	"5aa7e276e5b5b000171d0647", // Altyn bulletproof helmet
	"5ac8d6885acfc400180ae7b0", // Ops-Core FAST MT Super High Cut helmet (Tan)
	"5c091a4e0db834001d5addc8", // Maska-1SCh bulletproof helmet (Olive Drab)
	"5ca20ee186f774799474abc2", // Vulkan-5 (LShZ-5) bulletproof helmet
	"5c17a7ed2e2216152142459c", // Crye Precision AirFrame helmet (Tan)
	"5f60b34a41e30a4ab12a6947", // Galvion Caiman Hybrid helmet
	"5c0e874186f7745dc7616606", // Maska-1SCh bulletproof helmet (Killa)
	"5e00c1ad86f774747333222c", // Team Wendy EXFIL Ballistic Helmet (Black)
	"5e01ef6886f77445f643baa4", // Team Wendy EXFIL Ballistic Helmet (Coyote Brown)
	"5f60c85b58eff926626a60f7", // Rys-T face shield
	"5ca2113f86f7740b2547e1d2", // Vulkan-5 face shield
	"5a16b7e1fcdbcb00165aa6c9", // Ops-Core FAST multi-hit ballistic face shield
	"5c0919b50db834001b7ce3b9", // Maska-1SCh face shield (Olive Drab)
	"5e01f37686f774773c6f6c15", // Team Wendy EXFIL Ballistic face shield (Coyote Brown)
	"5e00cdd986f7747473332240", // Team Wendy EXFIL Ballistic face shield (Black)
	"5c0558060db834001b735271", // GPNVG-18 Night Vision goggles
	"5d1b5e94d7ad1a2b865a96b0", // FLIR RS-32 2.25-9x 35mm 60Hz thermal riflescope
	"5a1eaa87fcdbcb001865f75e", // Trijicon REAP-IR thermal scope
	"5cfe8010d7ad1a59283b14c6", // AK 7.62x39 X Products X-47 50-round drum magazine
	"5c6175362e221600133e3b94", // AK 7.62x39 ProMag AK-A-16 73-round drum magazine
	"59c1383d86f774290a37e0ca", // 5.56x45 Magpul PMAG D-60 STANAG 60-round magazine
	"544a37c44bdc2d25388b4567", // 5.56x45 SureFire MAG5-60 STANAG 60-round magazine
	"5ab8ebf186f7742d8b372e80", // SSO Attack 2 raid backpack
	"5c0e805e86f774683f3dd637", // 3V Gear Paratus 3-Day Operator's Tactical backpack
	"61b9e1aaef9a1b5d6a79899a", // Santa's bag
	"5f5e46b96bdad616ad46d613", // Eberlestock F4 Terminator load bearing backpack (Tiger Stripe)
	"59e763f286f7742ee57895da", // Pilgrim tourist backpack
	"6034d2d697633951dc245ea6", // Eberlestock G2 Gunslinger II backpack (Dry Earth)
	"5df8a4d786f77412672a1e3b", // 6Sh118 raid backpack
	"5c0e774286f77468413cc5b2", // Mystery Ranch Blackjack 50 backpack (Multicam)
	"5857a8b324597729ab0a0e7d", // Secure container Beta
	"5c0a794586f77461c458f892", // Secure container Boss
	"5c0a5a5986f77476aa30ae64", // Developer container
	"59db794186f77448bc595262", // Secure container Epsilon
	"5857a8bc2459772bad15db29", // Secure container Gamma
	"5c093ca986f7740a1867ab12", // Secure container Kappa
	"544a11ac4bdc2d470e8b456a", // Secure container Alpha
	"5732ee6a24597719ae0c0281", // Waist pouch
	"627a4e6b255f7527fb05a0f6", // Карманы 1 на 4 со спец слотами
	"557ffd194bdc2d28148b457f", // Pockets
	"60c7272c204bc17802313365", // Pockets 1x3
	"5af99e9186f7747c447120b8", // Pockets Large
	"61bcc89aef0f505f0c6cd0fc", // FirstSpear Strandhogg plate carrier rig (Ranger Green)
	"5d5d87f786f77427997cfaef", // Ars Arma A18 Skanda plate carrier
	"544a5caa4bdc2d1a388b4568", // Crye Precision AVS plate carrier
	"628d0618d1ba6e4fa07ce5a4", // NPP KlASS Bagariy armored rig
	"5e4ac41886f77406a511c9a8", // Ars Arma CPC MOD.2 plate carrier
	"5c0e746986f7741453628fe5", // WARTECH TV-110 plate carrier rig
	"628dc750b910320f4c27a732", // ECLiPSE RBAV-AF plate carrier (Ranger Green)
	"61bc85697113f767765c7fe7", // Eagle Industries MMAC plate carrier (Ranger Green)
	"609e860ebd219504d8507525", // Crye Precision AVS MBAV (Tagilla Edition)
	"628b9784bcf6e2659e09b8a2", // S&S Precision PlateFrame plate carrier (Goons Edition)
	"628b9c7d45122232a872358f", // Crye Precision CPC plate carrier (Goons Edition)
	"5b44cad286f77402a54ae7e5", // 5.11 Tactical TacTec plate carrier
	"60a3c70cde5f453f634816a3", // CQC Osprey MK4A plate carrier (Assault, MTP)
	"60a3c68c37ea821725773ef5", // CQC Osprey MK4A plate carrier (Protection, MTP)
	"628cd624459354321c4b7fa2", // Tasmanian Tiger SK plate carrier (Multicam Black)
	"5c0a840b86f7742ffa4f2482", // T H I C C item case
	"5b7c710788a4506dec015957", // Lucky Scav Junk box
	"5b6d9ce188a4501afc1b2b25", // T H I C C Weapon case
	"6183afd850224f204c1da514", // FN SCAR-H 7.62x51 assault rifle
	"606587252535c57a13424cfd", // CMMG Mk47 Mutant 7.62x39 assault rifle
	"5dcbd56fdbd3d91b3e5468d5", // Desert Tech MDR 7.62x51 assault rifle
	"6165ac306ef05c2ce828ef74", // FN SCAR-H 7.62x51 assault rifle (FDE)
	"628a60ae6b1d481ff772e9c8", // Rifle Dynamics RD-704 7.62x39 assault rifle
	"5e81ebcd8e146c7080625e15", // FN40GL Mk2 grenade launcher
	"6217726288ed9f0845317459", // RSP-30 reactive signal cartridge (Green)
	"62178c4d4ecf221597654e3d", // RSP-30 reactive signal cartridge (Red)
	"624c0b3340357b5f566e8766", // RSP-30 reactive signal cartridge (Yellow)
	"620109578d82e67e7911abf2", // ZiD SP-81 26x75 signal pistol
	"6176aca650224f204c1da3fb", // HK G28 7.62x51 marksman rifle
	"5df8ce05b11454561e39243b", // Knight's Armament Company SR-25 7.62x51 marksman rifle
	"5a367e5dc4a282000e49738f", // Remington R11 RSASS 7.62x51 marksman rifle
	"5aafa857e5b5b00018480968", // Springfield Armory M1A 7.62x51 rifle
	"5fc22d7c187fea44d52eda44", // SWORD International Mk-18 .338 LM marksman rifle
	"6275303a9f372d6ea97f9ec7", // M32A1 MSGL 40mm grenade launcher
	"5e848cc2988a8701445df1e8", // TOZ KS-23M 23x75mm pump-action shotgun
	"627e14b21713922ded6f2c15", // Accuracy International AXMC .338 LM bolt-action sniper rifle
	"5c94bbff86f7747ee735c08f", // TerraGroup Labs access keycard
	"5efb0cabfb3e451d70735af5", // .45 ACP AP (70/38)
	"5d6e68a8a4b9360b6c0d54e2", // 12/70 AP-20 armor-piercing slug (164/37)
	"5d6e68b3a4b9361bca7e50b5", // 12/70 Copper Sabot Premier HP slug (206/14)
	"5d6e68d1a4b93622fe60e845", // 12/70 SuperFormance HP slug (220/5)
	"5e85a9f4add9fe03027d9bf1", // 23x75mm "Zvezda" flashbang round (0/0)
	"62389aaba63f32501b1b444f", // 26x75mm flare cartridge (Green) (37/0)
	"62389ba9a63f32501b1b4451", // 26x75mm flare cartridge (Red) (37/0)
	"62389be94d5d474bf712e709", // 26x75mm flare cartridge (Yellow) (37/0)
	"5f0c892565703e5c461894e9", // 40x46mm M433 (HEDP) grenade
	"5ede47405b097655935d7d16", // 40x46mm M441 (HE) grenade
	"5ba26835d4351e0035628ff5", // 4.6x30mm AP SX (35/53)
	"5ba26844d4351e00334c9475", // 4.6x30mm Subsonic SX (45/36)
	"5c0d5e4486f77478390952fe", // 5.45x39mm PPBS gs "Igolnik" (37/62)
	"61962b617c6c7b169525f168", // 5.45x39mm 7N40 (52/44)
	"56dff026d2720bb8668b4567", // 5.45x39mm BS gs (40/51)
	"56dff061d2720bb5668b4567", // 5.45x39mm BT gs (42/40)
	"54527ac44bdc2d36668b4567", // 5.56x45mm M855A1 (49/44)
	"59e6906286f7746c9f75e847", // 5.56x45mm M856A1 (54/37)
	"59e690b686f7746c9f75e848", // 5.56x45mm M995 (42/53)
	"601949593ae8f707c4608daa", // 5.56x45mm SSA AP (38/57)
	"5cc80f67e4a949035e43bbba", // 5.7x28mm SB193 (54/35)
	"5cc80f38e4a949001152b560", // 5.7x28mm SS190 (49/37)
	"5fd20ff893a8961fc660a954", // .300 Blackout AP (51/48)
	"59e0d99486f7744a32234762", // 7.62x39mm BP gzh (58/47)
	"601aa3d2b2bcb34913271e6d", // 7.62x39mm MAI AP (47/58)
	"5a6086ea4f39f99cd479502f", // 7.62x51mm M61 (70/64)
	"5a608bf24f39f98ffc77720e", // 7.62x51mm M62 Tracer (79/44)
	"5efb0c1bd79ff02a1f5e68d9", // 7.62x51mm M993 (67/70)
	"5e023d34e8a400319a28ed44", // 7.62x54mm R BT gzh (78/55)
	"5e023d48186a883be655e551", // 7.62x54mm R BS gs (72/70)
	"560d61e84bdc2da74d8b4571", // 7.62x54mm R SNB gzh (75/62)
	"5fc382a9d724d907e2077dab", // .338 Lapua Magnum AP (115/79)
	"5fc275cf85fd526b824a571a", // .338 Lapua Magnum FMJ (122/47)
	"5fc382b6d6fa9c00c571bbc3", // .338 Lapua Magnum TAC-X (196/18)
	"5efb0da7a29a85116f6ea05f", // 9x19mm PBP gzh (52/39)
	"5c925fa22e221601da359b7b", // 9x19mm AP 6.3 (52/30)
	"5c0d688c86f77413ae3407b2", // 9x39mm BP gs (60/55)
	"57a0e5022459774d1673f889", // 9x39mm SP-6 gs (58/46)
	"5c0d668f86f7747ccb7f13b2", // 9x39mm SPP gs (68/40)
	"635267f063651329f75a4ee8", // 26x75mm distress signal flare (poison green) (37/0)
	"57372bd3245977670b7cd243", // 5.45x39mm BS gs ammo pack (30 pcs)
	"57372c89245977685d4159b1", // 5.45x39mm BT gs ammo pack (30 pcs)
	"57372b832459776701014e41", // 5.45x39mm BS gs ammo pack (120 pcs)
	"5c1260dc86f7746b106e8748", // 9x39mm BP gs ammo pack (8 pcs)
	"57372c21245977670937c6c2", // 5.45x39mm BT gs ammo pack (120 pcs)
	"5c1262a286f7743f8a69aab2", // 5.45x39mm PPBS gs "Igolnik" ammo pack (30 pcs)
	"57372bad245977670b7cd242", // 5.45x39mm BS gs ammo pack (120 pcs)
	"57372c56245977685e584582", // 5.45x39mm BT gs ammo pack (120 pcs)
	"5696686a4bdc2da3298b456a", // Dollars
	"569668774bdc2da2298b4568", // Euros
	"5449016a4bdc2d6f028b456f", // Roubles
	"617fd91e5539a84ec44ce155", // RGN hand grenade
	"618a431df1eb8e24b8741deb", // RGO hand grenade
]

class ItemInfo implements IPostDBLoadMod {
	private init(container: DependencyContainer) {
		database = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
		logger.info("[Item Info] Database data is loaded, working...")
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
		logger = container.resolve<ILogger>("WinstonLogger")
		if (config.delay.enabled) {
			logger.log(
				`[Item Info] Mod compatibility delay enabled (${config.delay.seconds} seconds), waiting for other mods data to load...`,
				LogTextColor.BLACK,
				LogBackgroundColor.CYAN
			)
			setTimeout(() => {
				this.init(container)
				this.ItemInfoMain()
			}, config.delay.seconds * 1000)
		} else {
			this.init(container)
			this.ItemInfoMain()
		}
	}

	private ItemInfoMain() {
		let userLocale = config.UserLocale
		if (!config.HideLanguageAlert) {
			logger.log(
				`[Item Info] This mod supports other languages! \nМод поддерживает другие языки! \nEste mod es compatible con otros idiomas! \nTen mod obsługuje inne języki! \nEnglish, Russian, Spanish, Korean are fully translated.\nHide this message in config.json`,
				LogTextColor.BLACK,
				LogBackgroundColor.WHITE
			)
			logger.log(
				`[Item Info] Your selected language is "${userLocale}". \nYou can now customise it in Item Info config.json file. \nLooking for translators, PM me! \nTranslation debug mode is availiable in translations.json`,
				LogTextColor.BLACK,
				LogBackgroundColor.GREEN
			)
		}
		if (translations.debug.enabled) {
			logger.warning(`Translation debugging mode enabled! Changing userLocale to ${translations.debug.languageToDebug}`)
			userLocale = translations.debug.languageToDebug
		}
		// Fill the missing translation dictionaries with English keys as a fallback + debug mode to help translations. Smart.
		for (const key in translations["en"]) {
			for (const lang in translations) {
				if (
					translations.debug.enabled &&
					lang != "en" &&
					lang == translations.debug.languageToDebug &&
					translations[translations.debug.languageToDebug][key] == translations["en"][key] &&
					key != ""
				) {
					logger.warning(translations.debug.languageToDebug + ` language "${translations[translations.debug.languageToDebug][key]}" is the same as in English`)
				}
				if (key in translations[lang] == false) {
					if (translations.debug.enabled && translations.debug.languageToDebug == lang) {
						logger.warning(`${lang} language is missing "${key}" transaition!`)
					}
					translations[lang][key] = translations["en"][key]
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

		for (const itemID in items) {
			const item = items[itemID]
			const itemInHandbook = this.getItemInHandbook(itemID)

			if (
				item._type === "Item" && // Check if the item is a real item and not a "node" type.
				itemInHandbook != undefined && // Ignore "useless" items
				item._props.QuestItem != true && // Ignore quest items.
				item._parent != "543be5dd4bdc2deb348b4569" // Ignore currencies.
			) {
				let name = this.getItemName(itemID, userLocale) // for debug only
				const i18n = translations[userLocale]
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
				let slotefficiencyString = ""
				let headsetDescription = ""
				let tier = ""
				let itemRarity = 0
				let spawnString = ""

				let fleaPrice = this.getFleaPrice(itemID)
				let itemBestVendor = this.getItemBestTrader(itemID, userLocale)
				let traderPrice = Math.round(itemBestVendor.price)
				let traderName = itemBestVendor.name

				let spawnChance = clientItems[itemID]?._props?.SpawnChance

				let slotDensity = this.getItemSlotDensity(itemID)

				let itemBarters = this.bartersResolver(itemID)
				let barterInfo = this.barterInfoGenerator(itemBarters, userLocale)
				let barterResourceInfo = this.barterResourceInfoGenerator(itemID, userLocale)
				let rarityArray = []
				rarityArray.push(barterInfo.rarity) // futureprofing, add other rarity calculations
				itemRarity = Math.min(...rarityArray)

				let isBanned = false
				if (config.useBSGStaticFleaBanlist) {
					BSGblacklist.includes(itemID) ? (isBanned = true) : (isBanned = false)
				} else {
					item._props.CanSellOnRagfair ? (isBanned = false) : (isBanned = true)
				}

				if (isBanned == true && itemRarity == 0) {
					fleaPrice = i18n.BANNED
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
						spawnString += `${i18n.Spawnchance}: ${spawnChance}%` + newLine + newLine
					}
				}

				if (config.FleaAbusePatch.enabled) {
					if (fleaPrice * ragfairConfig.dynamic.price.min < traderPrice && isBanned == false) {
						// Ignore banned items for compatibility with Softcore mod.
						// log(name)
						let fleaPriceFix = Math.round(traderPrice * (1 / ragfairConfig.dynamic.price.min + 0.01))
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
						tier = i18n.OVERPOWERED
						item._props.BackgroundColor = tiers.OVERPOWERED
					} else if (itemRarity == 1) {
						tier = i18n.COMMON
						item._props.BackgroundColor = tiers.COMMON
					} else if (itemRarity == 2) {
						tier = i18n.RARE
						item._props.BackgroundColor = tiers.RARE
					} else if (itemRarity == 3) {
						tier = i18n.EPIC
						item._props.BackgroundColor = tiers.EPIC
					} else if (itemRarity == 4) {
						tier = i18n.LEGENDARY
						item._props.BackgroundColor = tiers.LEGENDARY
					} else if (itemRarity == 5) {
						tier = i18n.UBER
						item._props.BackgroundColor = tiers.UBER
					} else if (spawnChance < 2 || itemRarity == 6) {
						// can get 6 from custom rules only
						tier = i18n.UNOBTAINIUM
						item._props.BackgroundColor = tiers.UNOBTAINIUM
						// log(name)
					} else if (itemRarity == 8) {
						// 8 is for custom dim red background
						tier = i18n.CUSTOM
						item._props.BackgroundColor = tiers.CUSTOM
					} else if (itemRarityFallback.includes("Common")) {
						tier = i18n.COMMON
						item._props.BackgroundColor = tiers.COMMON
					} else if (itemRarityFallback.includes("Rare")) {
						tier = i18n.RARE
						item._props.BackgroundColor = tiers.RARE
					} else if (itemRarityFallback.includes("Superrare")) {
						tier = i18n.EPIC
						item._props.BackgroundColor = tiers.EPIC
					} else if (itemRarityFallback == "Not_exist") {
						tier = i18n.LEGENDARY
						item._props.BackgroundColor = tiers.LEGENDARY
						// log(name)
					} else {
						// everything else that falls in here
						tier = i18n.UNKNOWN
						item._props.BackgroundColor = tiers.UNKNOWN
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
						armorDurabilityString += `${config.ArmorInfo.addArmorClassInfo ? i18n.Armorclass + ": " + item._props.armorClass + " | " : ""}${i18n.Effectivedurability}: ${Math.round(item._props.MaxDurability / armor.Destructibility)} (${i18n.Max}: ${item._props.MaxDurability} x ${locales[userLocale][`Mat${(item._props.ArmorMaterial)}`]}: ${roundWithPrecision(1 / armor.Destructibility, 1)}) | ${i18n.Repairdegradation}: ${Math.round(armor.MinRepairDegradation * 100)}% - ${Math.round(armor.MaxRepairDegradation * 100)}%` + newLine + newLine;
						//log(name)
						//log(armorDurabilityString)
					}
				}

				if (config.ContainerInfo.enabled) {
					if (item._props.Grids?.length > 0) {
						let totalSlots = 0
						for (const grid of item._props.Grids) {
							totalSlots += grid._props.cellsH * grid._props.cellsV
						}
						let slotefficiency = roundWithPrecision(totalSlots / (item._props.Width * item._props.Height), 2)
						// prettier-ignore
						slotefficiencyString += `${i18n.Slotefficiency}: ×${slotefficiency} (${totalSlots}/${item._props.Width * item._props.Height})` + newLine + newLine;
						// log(name)
						// log(slotefficiencyString)
					}
				}

				if (config.MarkValueableItems.enabled) {
					let itemvalue = traderPrice / slotDensity
					let fleaValue
					if (isBanned == true && config.MarkValueableItems.alwaysMarkBannedItems) {
						fleaValue = config.MarkValueableItems.fleaSlotValueThresholdBest + 1 // always mark flea banned items as best.
					} else {
						fleaValue = fleaPrice / slotDensity
					}

					if (items[itemID]._parent != "5795f317245977243854e041") {
						// ignore containers
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
					// prettier-ignore
					priceString += (config.PricesInfo.addFleaPrice ? i18n.Fleaprice + ": " + this.formatPrice(fleaPrice) + (fleaPrice > 0 ? "₽" : "") + " | " : "") + i18n.Valuation1 + traderName + i18n.Valuation2 + ": " + this.formatPrice(traderPrice) + "₽" + newLine + newLine;

					// log(priceString)
				}

				if (config.HeadsetInfo.enabled) {
					if (item._props.Distortion !== undefined) {
						let gain = item._props.CompressorGain
						let thresh = item._props.CompressorTreshold
						// prettier-ignore
						headsetDescription = `${i18n.AmbientVolume}: ${item._props.AmbientVolume}dB | ${i18n.Compressor}: ${i18n.Gain} +${gain}dB × ${i18n.Treshold} ${thresh}dB ≈ ×${Math.abs((gain * thresh) / 100)} ${i18n.Boost} | ${i18n.ResonanceFilter}: ${item._props.Resonance}@${item._props.CutoffFreq}Hz | ${i18n.Distortion}: ${Math.round(item._props.Distortion * 100)}%` + newLine + newLine;
						// log(name)
						// log(headsetDescription)
					}
				}

				if (config.BarterInfo.enabled) {
					if (barterInfo.barters.length > 1) {
						barterString = barterInfo.barters + newLine
						// log(name)
						// log(barterString)
					}
				}

				if (config.ProductionInfo.enabled) {
					let productionInfo = this.productionGenarator(itemID, userLocale)
					if (productionInfo.length > 1) {
						productionString = productionInfo + newLine
						// log(name)
						// log(productionString)
					}
				}

				if (config.BarterResourceInfo.enabled) {
					if (barterResourceInfo.length > 1) {
						usedForBarterString = barterResourceInfo + newLine
						// log(name)
						// log(usedForBarterString)
					}
				}

				if (config.QuestInfo.enabled) {
					const itemQuestInfo = this.QuestInfoGenerator(itemID, userLocale)
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
					const itemHideoutInfo = this.HideoutInfoGenerator(itemID, userLocale)
					if (itemHideoutInfo.length > 1) {
						usedForHideoutString = itemHideoutInfo + newLine
						// log(name)
						// log(usedForHideoutString)
					}
				}

				if (config.CraftingMaterialInfo.enabled) {
					const itemCraftingMaterialInfo = this.CraftingMaterialInfoGenarator(itemID, userLocale)
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
					slotefficiencyString +
					usedForQuestsString +
					usedForHideoutString +
					barterString +
					productionString +
					usedForCraftingString +
					usedForBarterString

				this.addToDescription(itemID, descriptionString, "prepend")

				const debug = false
				if (debug) {
					log(this.getItemName(itemID, userLocale))
					log(descriptionString)
					// log(this.getItemDescription(itemID, userLocale))
					log(`---`)
				}

				// this.addToName(itemID, "✅✓✔☑🗸⍻√❎❌✖✗✘☒", "append");
			}
		}
		logger.success("[Item Info] Finished processing items, enjoy!")
		if (translations.debug.enabled) {
			let debugItemIDlist = [
				"590a3efd86f77437d351a25b",
				"5c0e722886f7740458316a57",
				"5645bcc04bdc2d363b8b4572",
				"590c621186f774138d11ea29",
				"59faff1d86f7746c51718c9c",
				"5c0e625a86f7742d77340f62",
			]
			for (const debugItemID of debugItemIDlist) {
				logger.info(`---`)
				logger.info(newLine)
				logger.info(debugItemID)
				logger.info(this.getItemName(debugItemID, translations.debug.languageToDebug))
				logger.info(newLine)
				logger.info(this.getItemDescription(debugItemID, translations.debug.languageToDebug))
			}
		}
	}

	getItemName(itemID, locale = "en") {
		if (locales[locale][`${itemID} Name`] != undefined) {
			return locales[locale][`${itemID} Name`]
		} else {
			return locales["en"][`${itemID} Name`]
		}
	}

	getItemShortName(itemID, locale = "en") {
		if (locales[locale][`${itemID} ShortName`] != undefined) {
			return locales[locale][`${itemID} ShortName`]
		} else {
			return locales["en"][`${itemID} ShortName`]
		}
	}

	getItemDescription(itemID, locale = "en") {
		if (locales[locale][`${itemID} Description`] != undefined) {
			return locales[locale][`${itemID} Description`]
		} else {
			return locales["en"][`${itemID} Description`]
		}
	}

	formatPrice(price) {
		if (typeof price == "number" && config.FormatPrice == true) {
			return Intl.NumberFormat("en-US").format(price)
		} else {
			return price
		}
	}

	addToName(itemID, addToName, place, lang = "") {
		if (lang == "") {
			// I'm actually really proud of this one! If no lang argument is passed, it defaults to recursion for all languages.
			for (const locale in locales) {
				this.addToName(itemID, addToName, place, locale)
			}
		} else {
			let originalName = this.getItemName(itemID, lang)
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
			let originalShortName = this.getItemShortName(itemID, lang)
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
			let originalDescription = this.getItemDescription(itemID, lang)
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

	resolveBestTrader(handbookParentId, locale = "en") {
		// I stole this code from someone looong ago, can't remember where, PM me to give proper credit
		let traderSellCategory = ""
		let traderMulti = 0.54 // AVG fallback
		let altTraderSellCategory = ""
		let traderName = ""

		let handbookCategories = handbook.Categories.filter((i) => i.Id === handbookParentId)[0]

		traderSellCategory = handbookCategories?.Id // "?" check is for shitty custom items
		altTraderSellCategory = handbookCategories?.ParentId

		for (let i = 0; i < 8; i++) {
			if (traderList[i].base.sell_category.includes(traderSellCategory) || traderList[i].base.sell_category.includes(altTraderSellCategory)) {
				traderMulti = (100 - traderList[i].base.loyaltyLevels[0].buy_price_coef) / 100
				//traderName = traderList[i].base.nickname
				traderName = locales[locale][`${traderList[i].base._id} Nickname`]
				return {
					multi: traderMulti,
					name: traderName,
				}
			}
		}
		return traderMulti
	}

	getItemBestTrader(itemID, locale = "en") {
		let itemBasePrice = 1

		let handbookItem = this.getItemInHandbook(itemID)
		// log(handbookItem)
		let bestTrader = this.resolveBestTrader(handbookItem.ParentId, locale)
		let result = handbookItem.Price * bestTrader.multi
		return {
			price: result,
			name: bestTrader.name,
			ParentId: handbookItem.ParentId,
		}
	}

	getFleaPrice(itemID) {
		if (typeof fleaPrices[itemID] != undefined) {
			return fleaPrices[itemID]
		} else {
			return this.getItemInHandbook(itemID).Price
		}
	}

	getBestPrice(itemID) {
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
								this.bartersResolver(x[0]._tpl)
								// look into calculateItemWorth
								// I need help resolving this recursion for unbuyable items in weapon presets, it seems to work, but not really. feel dumb
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
					barterString += `${this.formatPrice(Math.round(rubles))}₽ + `
				} else if (resource._tpl == "569668774bdc2da2298b4568") {
					let euro = resource.count
					barterString += `${this.formatPrice(Math.round(euro))}€ ≈ ${this.formatPrice(Math.round(euroRatio * euro))}₽ + `
				} else if (resource._tpl == "5696686a4bdc2da3298b456a") {
					let dollars = resource.count
					barterString += `$${this.formatPrice(Math.round(dollars))} ≈ ${this.formatPrice(Math.round(dollarRatio * dollars))}₽ + `
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
				totalBarterPriceString = ` | Σ ≈ ${this.formatPrice(Math.round(totalBarterPrice))}₽`
			}
			barterString = barterString.slice(0, barterString.length - 3) + totalBarterPriceString + "\n"
		}
		return {
			prices: prices, //TODO
			barters: barterString,
			rarity: rarityArray.length == 0 ? 0 : Math.min(...rarityArray),
		}
	}

	barterResourceInfoGenerator(itemID, locale = "en") {
		// Refactor this abomination pls
		let baseBarterString = ""
		for (
			let trader = 0;
			trader < 7;
			trader++ // iterate excluding Fence sales.
		) {
			let traderName = locales[locale][`${traderList[trader].base._id} Nickname`]
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
						baseBarterString += translations[locale].Traded + " ×" + traderList[trader].assort.barter_scheme[barterID][0][srcs].count + " "
						baseBarterString +=
							translations[locale].at + " " + traderName + " " + translations[locale].lv + barterLoyaltyLevel + " > " + this.getItemName(bartedForItem, locale)

						let extendedBarterString = " < … + "
						for (let barterResource in barterResources) {
							totalBarterPrice += this.getFleaPrice(barterResources[barterResource]._tpl) * barterResources[barterResource].count
							if (barterResources[barterResource]._tpl != itemID) {
								extendedBarterString += this.getItemShortName(barterResources[barterResource]._tpl, locale)
								extendedBarterString += ` ×${barterResources[barterResource].count} + `
							}
						}
						if (totalBarterPrice != 0) {
							totalBarterPrice = ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(bartedForItem) - totalBarterPrice))}₽`
						} else {
							totalBarterPrice = ""
						}
						extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3)
						extendedBarterString += totalBarterPrice
						baseBarterString += extendedBarterString + "\n"
					}
				}
			}
		}
		return baseBarterString
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

	productionGenarator(itemID, locale = "en") {
		let craftableString = ""
		let rarityArray = []
		for (let recipeId in hideoutProduction) {
			if (itemID === hideoutProduction[recipeId].endProduct && hideoutProduction[recipeId].areaType != "21") {
				// Find every recipe for itemid and don't use Christmas Tree crafts
				let recipe = hideoutProduction[recipeId]
				let componentsString = ""
				let recipeAreaString = this.getCraftingAreaName(recipe.areaType, locale)
				let totalRecipePrice = 0
				let recipeDivision = ""

				for (
					let i = recipe.requirements.length - 1;
					i >= 0;
					i-- // Itterate
				) {
					if (recipe.requirements[i].type === "Area") {
						let recipeArea = recipe.requirements[i] // Find and save craft area object
						recipeAreaString = this.getCraftingAreaName(recipeArea.areaType, locale) + " " + translations[locale].lv + recipeArea.requiredLevel
						rarityArray.push(this.getCraftingRarity(recipeArea.areaType, recipeArea.requiredLevel))
					}
					if (recipe.requirements[i].type === "Item") {
						let craftComponentId = recipe.requirements[i].templateId
						let craftComponentCount = recipe.requirements[i].count
						let craftComponentPrice = this.getFleaPrice(craftComponentId)

						componentsString += this.getItemShortName(craftComponentId, locale) + " ×" + craftComponentCount + " + "
						totalRecipePrice += craftComponentPrice * craftComponentCount
					}
					if (recipe.requirements[i].type === "Resource") {
						// superwater calculation
						let craftComponentId = recipe.requirements[i].templateId
						let resourceProportion = recipe.requirements[i].resource / items[recipe.requirements[i].templateId]._props.Resource
						let craftComponentPrice = this.getFleaPrice(craftComponentId)

						componentsString += this.getItemShortName(craftComponentId, locale) + " ×" + Math.round(resourceProportion * 100) + "%" + " + "
						totalRecipePrice += Math.round(craftComponentPrice * resourceProportion)
					}
				}
				if (recipe.count > 1) {
					recipeDivision = " " + translations[locale].peritem
				}
				componentsString = componentsString.slice(0, componentsString.length - 3)
				if (recipe.endProduct == "59faff1d86f7746c51718c9c") {
					craftableString += `${translations[locale].Crafted} @ ${recipeAreaString}`
					const time = recipe.productionTime
					// prettier-ignore
					craftableString += ` | 1× GPU: ${convertTime(gpuTime(1), locale)}, 10× GPU: ${convertTime(gpuTime(10), locale)}, 25× GPU: ${convertTime(gpuTime(25), locale)}, 50× GPU: ${convertTime(gpuTime(50), locale)}`

// 					log(`
// // Base time (x${roundWithPrecision(145000/time, 2)}): ${convertTime(time)}, GPU Boost: x${roundWithPrecision(tables.hideout.settings.gpuBoostRate/0.041225, 2)}
// // 2× GPU: ${convertTime(gpuTime(2))} x${roundWithPrecision(time/gpuTime(2), 2)}
// // 10× GPU: ${convertTime(gpuTime(10))} x${roundWithPrecision(time/gpuTime(10), 2)}
// // 25× GPU: ${convertTime(gpuTime(25))} x${roundWithPrecision(time/gpuTime(25), 2)}
// // 50× GPU: ${convertTime(gpuTime(50))} x${roundWithPrecision(time/gpuTime(50), 2)}`)
				} else {
					craftableString += `${translations[locale].Crafted} ×${recipe.count} @ ${recipeAreaString} < `
					craftableString += `${componentsString} | Σ${recipeDivision} ≈ ${this.formatPrice(Math.round(totalRecipePrice / recipe.count))}₽\n`
				}

				function convertTime(time, locale = "en") {
					const hours = Math.trunc(time / 60 / 60)
					const minutes = Math.round((time - hours * 60 * 60) / 60)
					return `${hours}${locales[locale].HOURS} ${minutes}${locales[locale].Min}`
				}

				function gpuTime(gpus) {
					const time = hideoutProduction.find(x => x.endProduct == "59faff1d86f7746c51718c9c").productionTime
					return time / (1 + (gpus - 1) * tables.hideout.settings.gpuBoostRate)
				}
				// if (fleaPrice > totalRecipePrice/recipe.count) {
				// 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
				// 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + this.GetItemName(id) + " can be crafted at " + recipeAreaString)
				// }
			}
		}
		return craftableString
	}

	HideoutInfoGenerator(itemID, locale = "en") {
		// make it like this
		// const r = data.filter(d => d.courses.every(c => courses.includes(c.id)));

		let hideoutString = ""
		for (let area in hideoutAreas) {
			for (let s in hideoutAreas[area].stages) {
				for (let a in hideoutAreas[area].stages[s].requirements) {
					if (hideoutAreas[area].stages[s].requirements[a].templateId == itemID) {
						hideoutString += `${translations[locale].Need} ×${hideoutAreas[area].stages[s].requirements[a].count} > ${this.getCraftingAreaName(
							hideoutAreas[area].type,
							locale
						)} ${translations[locale].lv}${s}\n`
					}
				}
			}
		}
		// console.log(hideoutString)
		return hideoutString
	}

	CraftingMaterialInfoGenarator(itemID, locale = "en") {
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
							recipeAreaString = this.getCraftingAreaName(hideoutProduction[craftID].requirements[i].areaType, locale) + " " + translations[locale].lv +hideoutProduction[craftID].requirements[i].requiredLevel
						}
						if (hideoutProduction[craftID].requirements[i].type == "Item") {
							let craftComponent = hideoutProduction[craftID].requirements[i]
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString += this.getItemShortName(craftComponent.templateId, locale) + " ×" + craftComponent.count + " + "
							}
							totalRecipePrice += this.getFleaPrice(craftComponent.templateId) * craftComponent.count
						}
						if (hideoutProduction[craftID].requirements[i].type == "Resource") {
							let craftComponent = hideoutProduction[craftID].requirements[i]
							let resourceProportion = craftComponent.resource / items[craftComponent.templateId]._props.Resource
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString +=
									this.getItemShortName(craftComponent.templateId, locale) + " ×" + Math.round(resourceProportion * 100) + "%" + " + "
							}
							totalRecipePrice += Math.round(this.getFleaPrice(craftComponent.templateId) * resourceProportion)
						}
					}
					usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3)
					// prettier-ignore
					usedForCraftingComponentsString += ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(hideoutProduction[craftID].endProduct) * hideoutProduction[craftID].count - totalRecipePrice))}₽`
					// prettier-ignore
					usedForCraftingString += `${hideoutProduction[craftID].requirements[s].type == "Tool" ? translations[locale].Tool : translations[locale].Part + " ×" + hideoutProduction[craftID].requirements[s].count} > ${this.getItemName(hideoutProduction[craftID].endProduct, locale)} ×${hideoutProduction[craftID].count}`
					usedForCraftingString += ` @ ${recipeAreaString + usedForCraftingComponentsString}\n`
				}
			}
		}
		// console.log(hideoutString)
		// log (usedForCraftingString)
		return usedForCraftingString
	}

	QuestInfoGenerator(itemID, locale = "en") {
		let questString = ""
		for (let questID in quests) {
			let questName = locales[locale][`${questID} name`]

			let questConditions = quests[questID].conditions.AvailableForFinish
			for (let i in questConditions) {
				if (questConditions[i]._parent == "HandoverItem" && questConditions[i]._props.target[0] == itemID) {
					let trader = quests[questID].traderId
					//let tradeName = tables.traders[trader].base.nickname
					let traderName = locales[locale][`${trader} Nickname`]
					// prettier-ignore
					questString += `${translations[locale].Found} ${questConditions[i]._props.onlyFoundInRaid ? "(✔) " : ""}×${questConditions[i]._props.value} > ${questName} @ ${traderName}\n`
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
