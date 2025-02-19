// Abandon Hope All Ye Who Enter Here.
// If you have OCD or at least the slightest sense of beauty, or just have a linter installed, I beg you - just **leave**. You will thank me later.

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-inner-declarations */
import { DependencyContainer } from "tsyringe"

import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod"
import { IHideoutConfig } from "@spt/models/spt/config/IHideoutConfig"
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig"
import { LogBackgroundColor } from "@spt/models/spt/logging/LogBackgroundColor"
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor"
import { ILogger } from "@spt/models/spt/utils/ILogger"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { ItemBaseClassService } from "@spt/services/ItemBaseClassService"
import { ITemplateItem, IProps } from "@spt/models/eft/common/tables/ITemplateItem"
import { IHandbookItem, IHandbookBase } from "@spt/models/eft/common/tables/IHandbookBase"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { IHideoutProduction, IScavRecipe, IHideoutProductionData } from "@spt/models/eft/hideout/IHideoutProduction"
import { IHideoutArea } from "@spt/models/eft/hideout/IHideoutArea"
import { IQuest } from "@spt/models/eft/common/tables/IQuest"
import { IArmorMaterials } from "@spt/models/eft/common/IGlobals"
import { IBarterScheme, ITrader } from "@spt/models/eft/common/tables/ITrader"
import { Traders } from "@spt/models/enums/Traders"
import { ItemHelper } from "@spt/helpers/ItemHelper"
import { BaseClasses } from "@spt/models/enums/BaseClasses"

import config from "../config/config.json"
import tiers from "../config/tiers.json"
import translations from "./translations.json"
import { IItem } from "@spt/models/eft/common/tables/IItem"

// Using `this.` is perfectly fine. Much better than having ambiguous and typeless variables declared in some global scope
// Don't worry - there's always opportunities to learn :) - Terkoiz

const newLine = "\n"

const bsgBlacklist = [
	"544a11ac4bdc2d470e8b456a", // Secure container Alpha
	"544a37c44bdc2d25388b4567", // 5.56x45 SureFire MAG5-60 STANAG 60-round magazine
	"54527ac44bdc2d36668b4567", // 5.56x45mm M855A1
	"545cdb794bdc2d3a198b456a", // 6B43 Zabralo-Sh body armor (Digital Flora)
	"560d61e84bdc2da74d8b4571", // 7.62x54mm R SNB gzh
	"5648b62b4bdc2d9d488b4585", // GP-34 40mm underbarrel grenade launcher
	"56dfef82d2720bbd668b4567", // 5.45x39mm BP gs
	"56dff026d2720bb8668b4567", // 5.45x39mm BS gs
	"5732ee6a24597719ae0c0281", // Waist pouch
	"57372b832459776701014e41", // 5.45x39mm BS gs ammo pack (120 pcs)
	"57372bad245977670b7cd242", // 5.45x39mm BS gs ammo pack (120 pcs)
	"57372bd3245977670b7cd243", // 5.45x39mm BS gs ammo pack (30 pcs)
	"57372c21245977670937c6c2", // 5.45x39mm BT gs ammo pack (120 pcs)
	"57372c56245977685e584582", // 5.45x39mm BT gs ammo pack (120 pcs)
	"57372c89245977685d4159b1", // 5.45x39mm BT gs ammo pack (30 pcs)
	"57838ad32459774a17445cd2", // VSS Vintorez 9x39 special sniper rifle
	"57a0e5022459774d1673f889", // 9x39mm SP-6 gs
	"5857a8b324597729ab0a0e7d", // Secure container Beta
	"5857a8bc2459772bad15db29", // Secure container Gamma
	"58dd3ad986f77403051cba8f", // 7.62x51mm M80
	"5937ee6486f77408994ba448", // Machinery key
	"593962ca86f774068014d9af", // Unknown key
	"59c1383d86f774290a37e0ca", // 5.56x45 Magpul PMAG D-60 STANAG 60-round magazine
	"59db794186f77448bc595262", // Secure container Epsilon
	"59e0d99486f7744a32234762", // 7.62x39mm BP gzh
	"59e690b686f7746c9f75e848", // 5.56x45mm M995
	"59e763f286f7742ee57895da", // Pilgrim tourist backpack
	"59e77a2386f7742ee578960a", // 7.62x54mm R PS gzh
	"59f32bb586f774757e1e8442", // Dogtag BEAR
	"59f32c3b86f77472a31742f0", // Dogtag USEC
	"59faff1d86f7746c51718c9c", // Physical Bitcoin
	"5a154d5cfcdbcb001a3b00da", // Ops-Core FAST MT Super High Cut helmet (Black)
	"5a16b7e1fcdbcb00165aa6c9", // Ops-Core FAST multi-hit ballistic face shield
	"5a1eaa87fcdbcb001865f75e", // Trijicon REAP-IR thermal scope
	"5a6086ea4f39f99cd479502f", // 7.62x51mm M61
	"5a608bf24f39f98ffc77720e", // 7.62x51mm M62 Tracer
	"5aa7e276e5b5b000171d0647", // Altyn bulletproof helmet (Olive Drab)
	"5aafbcd986f7745e590fff23", // Medicine case
	"5ab8ebf186f7742d8b372e80", // SSO Attack 2 raid backpack (Khaki)
	"5ac8d6885acfc400180ae7b0", // Ops-Core FAST MT Super High Cut helmet (Urban Tan)
	"5b4329f05acfc47a86086aa1", // DevTac Ronin Respirator
	"5b6d9ce188a4501afc1b2b25", // T H I C C Weapon case
	"5b7c710788a4506dec015957", // Lucky Scav Junk box
	"5ba26835d4351e0035628ff5", // 4.6x30mm AP SX
	"5c0558060db834001b735271", // L3Harris GPNVG-18 night vision goggles
	"5c0919b50db834001b7ce3b9", // Maska-1SCh face shield (Olive Drab)
	"5c093ca986f7740a1867ab12", // Secure container Kappa
	"5c0a840b86f7742ffa4f2482", // T H I C C item case
	"5c0d5e4486f77478390952fe", // 5.45x39mm PPBS gs Igolnik
	"5c0d688c86f77413ae3407b2", // 9x39mm BP gs
	"5c0e66e2d174af02a96252f4", // Ops-Core SLAAP armor helmet plate (Tan)
	"5c0e774286f77468413cc5b2", // Mystery Ranch Blackjack 50 backpack (MultiCam)
	"5c0e805e86f774683f3dd637", // 3V Gear Paratus 3-Day Operator's Tactical backpack (Foliage Grey)
	"5c1260dc86f7746b106e8748", // 9x39mm BP gs ammo pack (8 pcs)
	"5c1262a286f7743f8a69aab2", // 5.45x39mm PPBS gs Igolnik ammo pack (30 pcs)
	"5c17a7ed2e2216152142459c", // Crye Precision AirFrame helmet (Tan)
	"5c6175362e221600133e3b94", // AK 7.62x39 ProMag AK-A-16 73-round drum magazine
	"5ca20ee186f774799474abc2", // Vulkan-5 LShZ-5 bulletproof helmet (Black)
	"5ca2113f86f7740b2547e1d2", // Vulkan-5 helmet face shield
	"5ca21c6986f77479963115a7", // FORT Redut-T5 body armor (Smog)
	"5cadf6eeae921500134b2799", // 12.7x55mm PS12B
	"5cc80f67e4a949035e43bbba", // 5.7x28mm SB193
	"5cfe8010d7ad1a59283b14c6", // AK 7.62x39 X Products X-47 50-round drum magazine
	"5d1b5e94d7ad1a2b865a96b0", // FLIR RS-32 2.25-9x 35mm 60Hz thermal riflescope
	"5d6e68a8a4b9360b6c0d54e2", // 12/70 AP-20 armor-piercing slug
	"5d6e68b3a4b9361bca7e50b5", // 12/70 Copper Sabot Premier HP slug
	"5dcbd56fdbd3d91b3e5468d5", // Desert Tech MDR 7.62x51 assault rifle
	"5df8a4d786f77412672a1e3b", // 6Sh118 raid backpack (Digital Flora)
	"5df8a6a186f77412640e2e80", // Christmas tree ornament (Red)
	"5df8a72c86f77412640e2e83", // Christmas tree ornament (Silver)
	"5df8a77486f77412672a1e3f", // Christmas tree ornament (Violet)
	"5e00c1ad86f774747333222c", // Team Wendy EXFIL Ballistic Helmet (Black)
	"5e00cdd986f7747473332240", // Team Wendy EXFIL Ballistic face shield (Black)
	"5e01ef6886f77445f643baa4", // Team Wendy EXFIL Ballistic Helmet (Coyote Brown)
	"5e01f37686f774773c6f6c15", // Team Wendy EXFIL Ballistic face shield (Coyote Brown)
	"5e023d34e8a400319a28ed44", // 7.62x54mm R BT gzh
	"5e023d48186a883be655e551", // 7.62x54mm R BS gs
	"5e81ebcd8e146c7080625e15", // FN40GL Mk2 40mm grenade launcher
	"5e848cc2988a8701445df1e8", // TOZ KS-23M 23x75mm pump-action shotgun
	"5e85a9f4add9fe03027d9bf1", // 23x75mm Zvezda flashbang round
	"5ea18c84ecf1982c7712d9a2", // Diamond Age Bastion helmet armor plate
	"5ede47405b097655935d7d16", // 40x46mm M441 (HE) grenade
	"5ede474b0c226a66f5402622", // 40x46mm M381 (HE) grenade
	"5efb0c1bd79ff02a1f5e68d9", // 7.62x51mm M993
	"5f0596629e22f464da6bbdd9", // .366 TKM AP-M
	"5f0c892565703e5c461894e9", // 40x46mm M433 (HEDP) grenade
	"5f5e46b96bdad616ad46d613", // Eberlestock F4 Terminator load bearing backpack (Tiger Stripe)
	"5f60b34a41e30a4ab12a6947", // Galvion Caiman Hybrid helmet (Grey)
	"5f60c74e3b85f6263c145586", // Rys-T bulletproof helmet (Black)
	"5f60c85b58eff926626a60f7", // Rys-T face shield
	"5fc22d7c187fea44d52eda44", // SWORD International Mk-18 .338 LM marksman rifle
	"5fc275cf85fd526b824a571a", // .338 Lapua Magnum FMJ
	"5fc382a9d724d907e2077dab", // .338 Lapua Magnum AP
	"5fd20ff893a8961fc660a954", // .300 Blackout AP
	"601949593ae8f707c4608daa", // 5.56x45mm SSA AP
	"601aa3d2b2bcb34913271e6d", // 7.62x39mm MAI AP
	"6034d2d697633951dc245ea6", // Eberlestock G2 Gunslinger II backpack (Dry Earth)
	"60a283193cb70855c43a381d", // NFM THOR Integrated Carrier body armor
	"60a7ad2a2198820d95707a2e", // Tagilla's welding mask "UBEY"
	"60a7ad3a0c5cb24b0134664a", // Tagilla's welding mask "Gorilla"
	"614451b71e5874611e2c7ae5", // Bottle of Tarkovskaya vodka
	"6165ac306ef05c2ce828ef74", // FN SCAR-H 7.62x51 assault rifle (FDE)
	"617fd91e5539a84ec44ce155", // RGN hand grenade
	"6183afd850224f204c1da514", // FN SCAR-H 7.62x51 assault rifle
	"618a431df1eb8e24b8741deb", // RGO hand grenade
	"61962b617c6c7b169525f168", // 5.45x39mm 7N40
	"61962d879bb3d20b0946d385", // 9x39mm PAB-9 gs
	"619bc61e86e01e16f839a999", // Armband (Alpha)
	"619bddc6c9546643a67df6ee", // Armband (DEADSKUL)
	"619bddffc9546643a67df6f0", // Armband (Train Hard)
	"619bde3dc9546643a67df6f2", // Armband (Kiba Arms)
	"619bdeb986e01e16f839a99e", // Armband (RFARMY)
	"619bdf9cc9546643a67df6f8", // Armband (UNTAR)
	"61b9e1aaef9a1b5d6a79899a", // Santa's bag
	"620109578d82e67e7911abf2", // ZiD SP-81 26x75 signal pistol
	"62178c4d4ecf221597654e3d", // RSP-30 reactive signal cartridge (Red)
	"62389aaba63f32501b1b444f", // 26x75mm flare cartridge (Green)
	"62389ba9a63f32501b1b4451", // 26x75mm flare cartridge (Red)
	"6275303a9f372d6ea97f9ec7", // Milkor M32A1 MSGL 40mm grenade launcher
	"627e14b21713922ded6f2c15", // Accuracy International AXMC .338 LM bolt-action sniper rifle
	"62963c18dbc8ab5f0d382d0b", // Death Knight mask
	"62a61bbf8ec41a51b34758d2", // Big Pipe's smoking pipe
	"62e7e7bbe6da9612f743f1e0", // GP-25 Kostyor 40mm underbarrel grenade launcher
	"62e910aaf957f2915e0a5e36", // Digital secure DSP radio transmitter
	"635267f063651329f75a4ee8", // 26x75mm flare cartridge (Acid Green)
	"6357c98711fb55120211f7e1", // M203 40mm underbarrel grenade launcher
	"6389c7750ef44505c87f5996", // Microcontroller board
	"6389c7f115805221fb410466", // Far-forward GPS Signal Amplifier Unit
	"6389c85357baa773a825b356", // Advanced current converter
	"6389c8fb46b54c634724d847", // Silicon Optoelectronic Integrated Circuits textbook
	"6389c92d52123d5dd17f8876", // Advanced Electronic Materials textbook
	"639346cc1c8f182ad90c8972", // Tasmanian Tiger Trooper 35 backpack (Khaki)
	"6398fd8ad3de3849057f5128", // Backup hideout key
	"63a0b2eabea67a6d93009e52", // Radio repeater
	"63a39e1d234195315d4020bd", // Primorsky 46-48 skybridge key
	"63fc44e2429a8a166c7f61e6", // Armasight Zeus-Pro 640 2-8x50 30Hz thermal scope
	"6410733d5dd49d77bd07847e", // Tokarev AVT-40 7.62x54R automatic rifle
	"64637076203536ad5600c990", // Kalashnikov PKM 7.62x54R machine gun
	"6478641c19d732620e045e17", // SIG Sauer ECHO1 1-2x30mm 30Hz thermal reflex scope
	"648983d6b5a2df1c815a04ec", // 12.7x55mm PS12B (10 pcs)
	"6489848173c462723909a14b", // .338 Lapua Magnum AP ammo pack (20 pcs)
	"648984b8d5b4df6140000a1a", // 7.62x54mm R BS ammo pack (20 pcs)
	"648984e3f09d032aa9399d53", // 7.62x51mm M993 ammo pack (20 pcs)
	"6489851fc827d4637f01791b", // 7.62x39mm MAI AP ammo pack (20 pcs)
	"6489854673c462723909a14e", // 9x39mm BP ammo pack (20 pcs)
	"64898583d5b4df6140000a1d", // 5.56x45mm SSA AP ammo pack (50 pcs)
	"648985c074a806211e4fb682", // .300 Blackout AP ammo pack (50 pcs)
	"64898602f09d032aa9399d56", // 5.45x39mm 7N40 ammo pack (30 pcs)
	"648986bbc827d4637f01791e", // 5.7x28mm SS190 ammo pack (50 pcs)
	"6489870774a806211e4fb685", // 4.6x30mm AP SX ammo pack (40 pcs)
	"6489875745f9ca4ba51c4808", // 9x21mm BT ammo pack (30 pcs)
	"6489879db5a2df1c815a04ef", // .45 ACP AP ammo pack (50 pcs)
	"648987d673c462723909a151", // 9x19mm PBP ammo pack (50 pcs)
	"64898838d5b4df6140000a20", // 12/70 AP-20 ammo pack (25 pcs)
	"64acea16c4eda9354b0226b0", // 7.62x39mm BP gzh ammo pack (20 pcs)
	"64afc71497cf3a403c01ff38", // Granit Br5 ballistic plate
	"64afdcb83efdfea28601d041", // ESAPI level IV ballistic plate
	"64b8725c4b75259c590fa899", // .300 Blackout CBJ
	"64ca3d3954fc657e230529cc", // Kalashnikov PKP 7.62x54R infantry machine gun
	"64d0b40fbe2eed70e254e2d4", // Sacred Amulet
	"64d4b23dc1b37504b41ac2b6", // Rusted bloody key
	"651450ce0e00edc794068371", // SR-3M 9x39 compact assault rifle
	"65268d8ecb944ff1e90ea385", // Degtyarev RPDN 7.62x39 machine gun
	"65290f395ae2ae97b80fdf2d", // SIG MCX-SPEAR 6.8x51 assault rifle
	"6529243824cbe3c74a05e5c1", // 6.8x51mm SIG Hybrid
	"654a4a964b446df1ad03f192", // Granit 4RS ballistic plates (Back)
	"65573fa5655447403702a816", // Granit Br4 ballistic plate
	"655746010177119f4a097ff7", // SAPI level III+ ballistic plate
	"656efaf54772930db4031ff5", // Granit 4 ballistic plates (Back)
	"656f611f94b480b8a500c0db", // Granit 4 ballistic plate (Front)
	"656f63c027aed95beb08f62c", // Granit 4RS ballistic plate (Front)
	"656f664200d62bcd2e024077", // Korund-VM ballistic plates (Front)
	"656f66b5c6baea13cd07e108", // Korund-VM-K ballistic plates (Front)
	"656fa53d94b480b8a500c0e4", // TallCom Guardian ballistic plate
	"656fa61e94b480b8a500c0e8", // NESCO 4400-SA-MC ballistic plate
	"656fa76500d62bcd2e024080", // Kiba Arms Steel ballistic plate
	"656fa8d700d62bcd2e024084", // Cult Locust ballistic plate
	"656fa99800d62bcd2e024088", // Cult Termite ballistic plate
	"656fae5f7c2d57afe200c0d7", // GAC 3s15m ballistic plate
	"656faf0ca0dce000a2020f77", // GAC 4sss2 ballistic plate
	"656fafe3498d1b7e3e071da4", // KITECO SC-IV SA ballistic plate
	"657023a9126cc4a57d0e17a6", // .300 Blackout CBJ ammo pack (50 pcs)
	"657023b1cfc010a0f50069e5", // .300 Blackout M62 Tracer ammo pack (50 pcs)
	"657023b71419851aef03e6e8", // .300 Blackout V-Max ammo pack (50 pcs)
	"657023bebfc87b3a34093207", // .300 Blackout BCP FMJ ammo pack (50 pcs)
	"657023c61419851aef03e6eb", // .300 Whisper ammo pack (50 pcs)
	"657023ccbfc87b3a3409320a", // .338 Lapua Magnum FMJ ammo pack (20 pcs)
	"657023d6cfc010a0f50069e9", // .338 Lapua Magnum TAC-X ammo pack (20 pcs)
	"657023dabfc87b3a3409320d", // .338 Lapua Magnum UCW ammo pack (20 pcs)
	"657023decfc010a0f50069ec", // .357 Magnum FMJ ammo pack (25 pcs)
	"657023e31419851aef03e6ee", // .357 Magnum HP ammo pack (25 pcs)
	"657023e7c5d7d4cb4d078552", // .357 Magnum JHP ammo pack (25 pcs)
	"657023eccfc010a0f50069ef", // .357 Magnum SP ammo pack (25 pcs)
	"657023f1bfc87b3a34093210", // .366 TKM FMJ ammo pack (20 pcs)
	"657023f81419851aef03e6f1", // .366 TKM AP-M ammo pack (20 pcs)
	"657023fcbfc87b3a34093213", // .366 TKM Geksa ammo pack (20 pcs)
	"657024011419851aef03e6f4", // .366 TKM EKO ammo pack (20 pcs)
	"65702406bfc87b3a34093216", // .45 ACP Hydra-Shok ammo pack (50 pcs)
	"6570240a1419851aef03e6f7", // .45 ACP Lasermatch FMJ ammo pack (50 pcs)
	"6570240ecfc010a0f50069f2", // .45 ACP Match FMJ ammo pack (50 pcs)
	"65702414c5d7d4cb4d078555", // .45 ACP RIP ammo pack (50 pcs)
	"6570241bcfc010a0f50069f5", // 12.7x55mm PS12 ammo pack (10 pcs)
	"65702420bfc87b3a34093219", // 12.7x55mm PS12A ammo pack (10 pcs)
	"65702426cfc010a0f50069f8", // 12/70 5.25mm buckshot ammo pack (25 pcs)
	"65702432bfc87b3a3409321c", // 12/70 6.5mm Express buckshot ammo pack (25 pcs)
	"657024361419851aef03e6fa", // 12/70 7mm buckshot ammo pack (25 pcs)
	"6570243bbfc87b3a3409321f", // 12/70 8.5mm Magnum buckshot ammo pack (25 pcs)
	"6570243fcfc010a0f50069fb", // 12/70 Dual Sabot slug ammo pack (25 pcs)
	"657024431419851aef03e6fd", // 12/70 Piranha ammo pack (25 pcs)
	"65702449bfc87b3a34093223", // 12/70 FTX Custom Lite slug ammo pack (25 pcs)
	"6570244ec5d7d4cb4d078558", // 12/70 Grizzly 40 slug ammo pack (25 pcs)
	"65702452cfc010a0f50069fe", // 12/70 Poleva-3 slug ammo pack (25 pcs)
	"657024581419851aef03e700", // 12/70 Poleva-6u slug ammo pack (25 pcs)
	"65702469c5d7d4cb4d07855b", // 12/70 makeshift .50 BMG slug ammo pack (25 pcs)
	"6570246fcfc010a0f5006a01", // 12/70 lead slug ammo pack (25 pcs)
	"65702474bfc87b3a34093226", // 12/70 flechette ammo pack (25 pcs)
	"65702479c5d7d4cb4d07855e", // 12/70 Copper Sabot Premier HP slug ammo pack (25 pcs)
	"6570247ebfc87b3a34093229", // 12/70 SuperFormance HP slug ammo pack (25 pcs)
	"657024831419851aef03e703", // 20/70 5.6mm buckshot ammo pack (25 pcs)
	"6570248dcfc010a0f5006a04", // 20/70 6.2mm buckshot ammo pack (25 pcs)
	"657024921419851aef03e706", // 20/70 7.3mm buckshot ammo pack (25 pcs)
	"65702495c5d7d4cb4d078561", // 20/70 7.5mm buckshot ammo pack (25 pcs)
	"6570249bcfc010a0f5006a07", // 20/70 Devastator slug ammo pack (25 pcs)
	"6570249f1419851aef03e709", // 20/70 Star slug ammo pack (25 pcs)
	"657024a4bfc87b3a3409322c", // 20/70 Poleva-3 slug ammo pack (25 pcs)
	"657024a91419851aef03e70c", // 20/70 Poleva-6u slug ammo pack (25 pcs)
	"657024aebfc87b3a3409322f", // 23x75mm Shrapnel-10 buckshot ammo pack (5 pcs)
	"657024b31419851aef03e70f", // 23x75mm Shrapnel-25 buckshot ammo pack (5 pcs)
	"657024b8bfc87b3a34093232", // 23x75mm Barrikada slug ammo pack (5 pcs)
	"657024bdc5d7d4cb4d078564", // 23x75mm Zvezda flashbang round ammo pack (5 pcs)
	"657024c81419851aef03e712", // 4.6x30mm Action SX ammo pack (40 pcs)
	"657024cecfc010a0f5006a0a", // 4.6x30mm FMJ SX ammo pack (40 pcs)
	"657024d2bfc87b3a34093235", // 4.6x30mm Subsonic SX ammo pack (40 pcs)
	"657024d8c5d7d4cb4d078567", // 5.56x45mm FMJ ammo pack (50 pcs)
	"657024debfc87b3a34093238", // 5.56x45mm HP ammo pack (50 pcs)
	"657024e3c5d7d4cb4d07856a", // 5.56x45mm M855A1 ammo pack (50 pcs)
	"657024e8cfc010a0f5006a0d", // 5.56x45mm M856 ammo pack (50 pcs)
	"657024ecc5d7d4cb4d07856d", // 5.56x45mm M856A1 ammo pack (50 pcs)
	"657024f01419851aef03e715", // 5.56x45mm M995 ammo pack (50 pcs)
	"657024f5cfc010a0f5006a10", // 5.56x45mm MK 255 Mod 0 (RRLP) ammo pack (50 pcs)
	"657024f9bfc87b3a3409323b", // 5.56x45mm MK 318 Mod 0 (SOST) ammo pack (50 pcs)
	"657025161419851aef03e718", // 5.7x28mm L191 ammo pack (50 pcs)
	"6570251ccfc010a0f5006a13", // 5.7x28mm R37.F ammo pack (50 pcs)
	"65702520bfc87b3a3409323e", // 5.7x28mm R37.X ammo pack (50 pcs)
	"65702524cfc010a0f5006a16", // 5.7x28mm SB193 ammo pack (50 pcs)
	"657025281419851aef03e71b", // 5.7x28mm SS197SR ammo pack (50 pcs)
	"6570252dbfc87b3a34093241", // 5.7x28mm SS198LF ammo pack (50 pcs)
	"65702532cfc010a0f5006a19", // 7.62x25mm ТТ FMJ43 ammo pack (25 pcs)
	"65702536c5d7d4cb4d078570", // 7.62x25mm ТТ LRN ammo pack (25 pcs)
	"6570253acfc010a0f5006a1c", // 7.62x25mm ТТ LRNPC ammo pack (25 pcs)
	"6570253ec5d7d4cb4d078573", // 7.62x25mm TT AKBS ammo pack (25 pcs)
	"657025421419851aef03e71e", // 7.62x25mm TT P gl ammo pack (25 pcs)
	"65702546cfc010a0f5006a1f", // 7.62x25mm TT Pst gzh ammo pack (25 pcs)
	"6570254abfc87b3a34093244", // 7.62x25mm TT PT gzh ammo pack (25 pcs)
	"6570254fcfc010a0f5006a22", // 7.62x51mm M61 ammo pack (20 pcs)
	"65702554bfc87b3a34093247", // 7.62x51mm M62 Tracer ammo pack (20 pcs)
	"65702558cfc010a0f5006a25", // 7.62x51mm M80 ammo pack (20 pcs)
	"6570255dbfc87b3a3409324a", // 7.62x51mm Ultra Nosler ammo pack (20 pcs)
	"65702561cfc010a0f5006a28", // 7.62x51mm BCP FMJ ammo pack (20 pcs)
	"65702566bfc87b3a3409324d", // 7.62x51mm TCW SP ammo pack (20 pcs)
	"65702572c5d7d4cb4d078576", // 7.62x54mm R BT gzh ammo pack (20 pcs)
	"65702577cfc010a0f5006a2c", // 7.62x54mm R LPS gzh ammo pack (20 pcs)
	"6570257cc5d7d4cb4d078579", // 7.62x54mm R PS gzh ammo pack (20 pcs)
	"65702584cfc010a0f5006a2f", // 7.62x54mm R T-46M gzh ammo pack (20 pcs)
	"65702591c5d7d4cb4d07857c", // 9x19mm AP 6.3 ammo pack (50 pcs)
	"657025961419851aef03e721", // 9x19mm Green Tracer ammo pack (50 pcs)
	"6570259bc5d7d4cb4d07857f", // 9x19mm Luger CCI ammo pack (50 pcs)
	"6570259fcfc010a0f5006a32", // 9x19mm QuakeMaker ammo pack (50 pcs)
	"657025a4bfc87b3a34093250", // 9x19mm PSO gzh ammo pack (50 pcs)
	"657025a81419851aef03e724", // 9x19mm Pst gzh ammo pack (50 pcs)
	"657025bbcfc010a0f5006a35", // 9x21mm P gzh ammo pack (30 pcs)
	"657025c4c5d7d4cb4d078582", // 9x21mm PS gzh ammo pack (30 pcs)
	"657025c9cfc010a0f5006a38", // 9x21mm PE gzh ammo pack (30 pcs)
	"657025cfbfc87b3a34093253", // 9x39mm PAB-9 gs ammo pack (20 pcs)
	"657025d4c5d7d4cb4d078585", // 9x39mm SP-5 gs ammo pack (20 pcs)
	"657025dabfc87b3a34093256", // 9x39mm SP-6 gs ammo pack (20 pcs)
	"657025dfcfc010a0f5006a3b", // 9x39mm SPP gs ammo pack (20 pcs)
	"657025ebc5d7d4cb4d078588", // 5.45x39mm PPBS gs Igolnik ammo pack (120 pcs)
	"65702606cfc010a0f5006a3e", // 9x18mm PM BZhT gzh ammo pack (50 pcs)
	"6570260c1419851aef03e727", // 9x18mm PM P gzh ammo pack (50 pcs)
	"65702610cfc010a0f5006a41", // 9x18mm PM PBM gzh ammo pack (50 pcs)
	"65702614c5d7d4cb4d07858b", // 9x18mm PM PPT gzh ammo pack (50 pcs)
	"65702619bfc87b3a34093259", // 9x18mm PM PPe gzh ammo pack (50 pcs)
	"6570261dc5d7d4cb4d07858e", // 9x18mm PM PRS gs ammo pack (50 pcs)
	"65702621cfc010a0f5006a44", // 9x18mm PM PS gs PPO ammo pack (50 pcs)
	"657026251419851aef03e72a", // 9x18mm PM PSV ammo pack (50 pcs)
	"65702629cfc010a0f5006a47", // 9x18mm PM PSO gzh ammo pack (50 pcs)
	"6570262d1419851aef03e72d", // 9x18mm PM Pst gzh ammo pack (50 pcs)
	"65702630cfc010a0f5006a4a", // 9x18mm PM RG028 gzh ammo pack (50 pcs)
	"657026341419851aef03e730", // 9x18mm PM SP7 gzh ammo pack (50 pcs)
	"65702639bfc87b3a3409325c", // 9x18mm PM SP8 gzh ammo pack (50 pcs)
	"65702640cfc010a0f5006a4d", // 9x18mm PMM PstM gzh ammo pack (50 pcs)
	"657026451419851aef03e733", // 5.56x45mm FMJ ammo pack (100 pcs)
	"6570264acfc010a0f5006a50", // 5.56x45mm HP ammo pack (100 pcs)
	"6570264d1419851aef03e736", // 5.56x45mm M855 ammo pack (100 pcs)
	"65702652cfc010a0f5006a53", // 5.56x45mm M855A1 ammo pack (100 pcs)
	"65702656c5d7d4cb4d078591", // 5.56x45mm M856 ammo pack (100 pcs)
	"6570265bcfc010a0f5006a56", // 5.56x45mm M856A1 ammo pack (100 pcs)
	"6570265f1419851aef03e739", // 5.56x45mm M995 ammo pack (100 pcs)
	"65702664cfc010a0f5006a59", // 5.56x45mm MK 255 Mod 0 (RRLP) ammo pack (100 pcs)
	"6570266bc5d7d4cb4d078594", // 5.56x45mm MK 318 Mod 0 (SOST) ammo pack (100 pcs)
	"65702681bfc87b3a3409325f", // 5.56x45mm SSA AP ammo pack (100 pcs)
	"657089638db3adca1009f4ca", // Atomic Defense CQCM ballistic mask (Black)
	"6570900858b315e8b70a8a98", // 5.45x39mm 7N40 ammo pack (120 pcs)
	"65709d2d21b9f815e208ff95", // Diamond Age NeoSteel High Cut helmet (Black)
	"6570aead4d84f81fd002a033", // Death Shadow lightweight armored mask
	"65719f0775149d62ce0a670b", // NPP KlASS Tor-2 helmet (Olive Drab)
	"65719f9ef392ad76c50a2ec8", // NPP KlASS Tor-2 helmet face shield
	"6579846c1ec1943afb14c15a", // 9x21mm 7U4 ammo pack (30 pcs)
	"6579847c5a0e5879d12f2873", // 9x21mm 7N42 ammo pack (30 pcs)
	"657984a50fbff513dd435765", // 9x39mm FMJ ammo pack (20 pcs)
	"657b2797c3dbcb01d60c35ea", // Korund-VM ballistic plate (Back)
	"657b28d25f444d6dff0c6c77", // Korund-VM-K ballistic plate (Back)
	"65ca457b4aafb5d7fc0dcb5d", // United Cutlery M48 Tactical Kukri
	"65ddcc9cfa85b9f17d0dfb07", // Mark of The Unheard
	"660312cc4d6cdfa6f500c703", // Armband of The Unheard
	"660bbc98c38b837877075e4a", // Decrypted flash drive
	"660bc341c38b837877075e4c", // Documents with decrypted data
	"664a5428d5e33a713b622379", // APOK Tactical Wasteland Gladius
	"664a5480bfcc521bad3192ca", // Armband (ARENA)
	"664a55d84a90fc2c8a6305c9", // Secure container Theta
	"664d3db6db5dea2bad286955", // Shatun's hideout key
	"664d3dd590294949fe2d81b7", // Grumpy's hideout key
	"664d3ddfdda2e85aca370d75", // Voron's hideout key
	"664d3de85f2355673b09aed5", // Leon's hideout key
	"6655e35b6bc645cb7b059912", // "The Eye" mortar strike signaling device
	"6656560053eaaa7a23349c86", // Lega Medal
	"66571bf06a723f7f005a0619", // Locked equipment crate (Rare)
	"66572b3f6a723f7f005a066c", // Locked weapon crate (Rare)
	"66572b88ac60f009f270d1dc", // Locked supply crate (Rare)
	"66572bb3ac60f009f270d1df", // Locked valuables crate (Rare)
	"665730fa4de4820934746c48", // Unlocked equipment crate (Rare)
	"665732e7ac60f009f270d1ef", // Unlocked weapon crate (Rare)
	"665732f4464c4b4ba4670fa9", // Unlocked supply crate (Rare)
	"66573310a1657263d816a139", // Unlocked valuables crate (Rare)
	"665ee77ccf2d642e98220bca", // Secure container Gamma
	"6662e9aca7e0b43baa3d5f74", // Dogtag BEAR
	"6662e9cda7e0b43baa3d5f76", // Dogtag BEAR
	"6662e9f37fa79a6d83730fa0", // Dogtag USEC
	"6662ea05f6259762c56f3189", // Dogtag USEC
	"666b11055a706400b717cfa5", // Tripwire installation kit
	"66bc98a01a47be227a5e956e", // Streamer item case
	"66d9f1abb16d9aacf5068468", // RSP-30 reactive signal cartridge (Special Yellow)
	"66d9f7256916142b3b02276e", // Radar station spare parts
	"66d9f7e7099cf6adcc07a369", // KOSA UAV electronic jamming device
	"66d9f8744827a77e870ecaf1", // GARY ZONT portable electronic warfare device
	"66ffa9b66e19cc902401c5e8", // MPS Auto Assault-12 Gen 1 12ga automatic shotgun
	"67124dcfa3541f2a1f0e788b", // MPS Auto Assault-12 Gen 2 12ga automatic shotgun
]

class ItemInfo implements IPostDBLoadMod {
	database: DatabaseServer
	configServer: ConfigServer
	itemBaseClassService: ItemBaseClassService
	ragfairConfig: IRagfairConfig
	hideoutConfig: IHideoutConfig
	logger: ILogger
	tables: IDatabaseTables
	items: Record<string, ITemplateItem>
	handbook: IHandbookBase
	locales: Record<string, Record<string, string>>
	fleaPrices: Record<string, number>
	hideoutProduction: IHideoutProductionData
	hideoutAreas: IHideoutArea[]
	quests: Record<string, IQuest>
	armors: IArmorMaterials
	traders: Record<string, ITrader>
	traderList: ITrader[]
	euroRatio: number
	dollarRatio: number
	questRewardsDB: any
	itemHelper: ItemHelper
	props: IProps

	// ORM
	ORMGen: any
	private init(container: DependencyContainer) {
		this.database = container.resolve<DatabaseServer>("DatabaseServer")
		this.configServer = container.resolve<ConfigServer>("ConfigServer")
		this.itemBaseClassService = container.resolve<ItemBaseClassService>("ItemBaseClassService")
		this.ragfairConfig = this.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		this.hideoutConfig = this.configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
		this.itemHelper = container.resolve<ItemHelper>("ItemHelper")

		this.logger.info("[Item Info] Database data is loaded, working...")

		this.tables = this.database.getTables()
		this.items = this.tables.templates.items
		this.handbook = this.tables.templates.handbook
		this.locales = this.tables.locales.global
		this.fleaPrices = this.tables.templates.prices
		this.hideoutProduction = this.tables.hideout.production
		this.hideoutAreas = this.tables.hideout.areas
		this.quests = this.tables.templates.quests
		this.armors = this.tables.globals.config.ArmorMaterials
		this.traders = this.tables.traders

		// Hardcode list for best buy_price_coef
		this.traderList = [
			this.traders[Traders.THERAPIST],
			this.traders[Traders.RAGMAN],
			this.traders[Traders.JAEGER],
			this.traders[Traders.MECHANIC],
			this.traders[Traders.PRAPOR],
			this.traders[Traders.SKIER],
			this.traders[Traders.PEACEKEEPER],
		]
	}

	public postDBLoad(container: DependencyContainer) {
		this.logger = container.resolve<ILogger>("WinstonLogger")

		// TODO: With order.json being a thing, this can probably be removed and instead instructions for changing load order could be added
		if (config.delay.enabled) {
			this.logger.log(
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

	private ItemInfoMain(): void {
		let userLocale = config.UserLocale

		if (!config.HideLanguageAlert) {
			this.logger.log(
				"[Item Info] This mod supports other languages! \nМод поддерживает другие языки! \nEste mod es compatible con otros idiomas! \nTen mod obsługuje inne języki! \nEnglish, Russian, Spanish, Korean, French, Chinese, Japanese and German are fully translated.\nHide this message in config.json",
				LogTextColor.BLACK,
				LogBackgroundColor.WHITE
			)
			this.logger.log(
				`[Item Info] Your selected language is "${userLocale}". \nYou can now customise it in Item Info config.json file. \nLooking for translators, PM me! \nTranslation debug mode is availiable in translations.json`,
				LogTextColor.BLACK,
				LogBackgroundColor.GREEN
			)
		}

		if (translations.debug.enabled) {
			this.logger.warning(`Translation debugging mode enabled! Changing userLocale to ${translations.debug.languageToDebug}`)
			userLocale = translations.debug.languageToDebug
		}

		// Fill the missing translation dictionaries with English keys as a fallback + debug mode to help translations. Smart.
		for (const key in translations.en) {
			for (const lang in translations) {
				if (
					translations.debug.enabled &&
					lang !== "en" &&
					lang === translations.debug.languageToDebug &&
					translations[translations.debug.languageToDebug][key] === translations.en[key] &&
					key !== ""
				) {
					this.logger.warning(
						`${translations.debug.languageToDebug} language "${translations[translations.debug.languageToDebug][key]}" is the same as in English`
					)
				}

				if (key in translations[lang] === false) {
					if (translations.debug.enabled && translations.debug.languageToDebug === lang) {
						this.logger.warning(`${lang} language is missing "${key}" transaition!`)
					}

					translations[lang][key] = translations.en[key]
				}
			}
		}
		// log(this.hideoutProduction)
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

		this.euroRatio = this.handbook.Items.find((x) => x.Id === "569668774bdc2da2298b4568").Price
		this.dollarRatio = this.handbook.Items.find((x) => x.Id === "5696686a4bdc2da3298b456a").Price

		this.questRewardsDB = {}

		for (const questID in this.quests) {
			const questRewards = this.quests[questID].rewards.Started.concat(this.quests[questID].rewards.Success).filter((x) => x.type === "AssortmentUnlock")
			if (questRewards.length > 1) {
				this.questRewardsDB[questID] = {}
				// biome-ignore lint/complexity/noForEach: <explanation>
				questRewards.forEach((i) => {
					this.questRewardsDB[questID][i.target] = []
					// biome-ignore lint/complexity/noForEach: <explanation>
					i.items.forEach((x) => this.questRewardsDB[questID][i.target].push(x._tpl))
				})
			}
			/* 	
			if (questRewards.length > 1) {
				this.questRewardsDB[questID] = {}
				questRewards.forEach((i) => {
					this.questRewardsDB[questID][i.target] = []
					i.items.forEach((x) => this.questRewardsDB[questID][i.target].push(x._tpl))
				})
			} 
			*/

			/* 
			if (questRewards.length > 1) {
				this.questRewardsDB[questID] = {}
				this.questRewardsDB[questID].questID = questID
				questRewards.forEach((i) => {
					// this.questRewardsDB[questID][i.target] = []
					this.questRewardsDB[questID].rewards = []
					this.questRewardsDB[questID].rewards.push({ rewardBarterID: i.target })
					this.questRewardsDB[questID][rewardBarterID][i.target].items = []
					// i.items.forEach((x) => this.questRewardsDB[questID].rewardBarterID[i.target].items.push(x._tpl))
				})
			}
 			// */
		}

		// ORM
		this.ORMGen = {}

		// log(this.questRewardsDB)

		for (const itemID in this.items) {
			const item = this.items[itemID]
			const itemInHandbook = this.getItemInHandbook(itemID)

			if (
				item._type === "Item" && // Check if the item is a real item and not a "node" type.
				itemInHandbook !== undefined && // Ignore "useless" items
				!item._props.QuestItem && // Ignore quest items.
				item._parent !== "543be5dd4bdc2deb348b4569" // Ignore currencies.
			) {
				const name = this.getItemName(itemID, userLocale) // for debug only
				// item._props.ExaminedByDefault = true // DEBUG!!!

				// BSG Blacklist generator
				// if (item._props.CanSellOnRagfair == false) {
				// 	// log(itemID)
				// 	// log(this.getItemName(itemID, userLocale))
				// 	log(`"${itemID}", // ${this.getItemName(itemID, "en")}`)
				// }

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
				let slotefficiencyString = ""
				let headsetDescription = ""
				let advancedAmmoInfoString = ""
				let tier = ""
				let itemRarity = 0

				let fleaPrice = this.getFleaPrice(itemID)
				const itemBestVendor = this.getItemBestTrader(itemID, userLocale)
				let traderPrice = Math.round(itemBestVendor.price)
				const traderName = itemBestVendor.name

				let slotDensity = this.getItemSlotDensity(itemID)

				const itemBarters = this.bartersResolver(itemID)
				const barterInfo = this.barterInfoGenerator(itemBarters, userLocale)
				const barterResourceInfo = this.barterResourceInfoGenerator(itemID, userLocale)
				const rarityArray = barterInfo.rarity
				// rarityArray.push(barterInfo.rarity) // futureprofing, add other rarity calculations
				const itemQuestInfo = this.QuestInfoGenerator(itemID, userLocale)
				// if (rarityArray.length > 1) {
				// 	log(`${this.getItemName(itemID)}, ${itemRarity} | ${rarityArray}`)
				// }
				itemRarity = Math.min(...rarityArray)
				// let RarityPvE = item._props.RarityPvE
				// log(`${this.getItemName(itemID)} | ${RarityPvE}`)
				let isBanned = false
				if (config.useBSGStaticFleaBanlist) {
					isBanned = bsgBlacklist.includes(itemID)
				} else {
					isBanned = !item._props.CanSellOnRagfair
				}

				if (isBanned) {
					fleaPrice = i18n.BANNED

					if (!itemRarity) {
						itemRarity = 7
					} else {
						// itemRarity += 1
						// log(`${this.getItemName(itemID)}, ${itemRarity}`)
					}
				}

				if (
					(this.itemHelper.isOfBaseclass(itemID, BaseClasses.MOD) ||
						this.itemHelper.isOfBaseclass(itemID, BaseClasses.ARMOR) ||
						this.itemHelper.isOfBaseclass(itemID, BaseClasses.AMMO) ||
						this.itemHelper.isOfBaseclass(itemID, BaseClasses.ARMOR_PLATE) ||
						this.itemHelper.isOfBaseclass(itemID, BaseClasses.VEST) ||
						this.itemHelper.isOfBaseclass(itemID, BaseClasses.WEAPON) ||
						item._parent === "57bef4c42459772e8d35a53b") && // strictly ARMORED_EQUIPMENT
					barterInfo.barters.length === 0 &&
					!isBanned
				) {
					itemRarity = 6
					// log(`${this.getItemName(itemID)}, ${this.getItemName(item._parent)}, ${item._parent}`)
				}

				if (itemQuestInfo.includes("↺") && !itemQuestInfo.includes("∈") && rarityArray.length < 4) {
					// well...
					itemRarity += 2
					// log(`${this.getItemName(itemID)}, ${itemRarity} | ${rarityArray}`)
				}

				if (item._parent === "543be5cb4bdc2deb348b4568") {
					// Ammo boxes special case
					const count = item._props.StackSlots[0]._max_count
					const ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]

					const value = this.getItemBestTrader(ammo).price
					// let value = this.getItemInHandbook(ammo).price
					traderPrice = value * count

					if (!itemRarity || itemRarity === 7) {
						itemRarity = bsgBlacklist.includes(ammo) ? 7 : Math.min(...this.barterInfoGenerator(this.bartersResolver(ammo)).rarity) // my magnum opus
					}
				}

				if (config.BulletStatsInName.enabled) {
					if (item._props.ammoType === "bullet" || item._props.ammoType === "buckshot") {
						let damageMult = 1
						if (item._props.ammoType === "buckshot") {
							damageMult = item._props.buckshotBullets
						}
						this.addToName(itemID, ` (${item._props.Damage * damageMult}/${item._props.PenetrationPower})`, "append")
					}
					// If parent is ammobox
					if (item._parent === "543be5cb4bdc2deb348b4568") {
						const ammoSlots = item._props.StackSlots;
						if (ammoSlots !== undefined && ammoSlots.length > 0) {
							const stack = ammoSlots[0];
							const bulletId = stack._props.filters[0].Filter[0];
							const bulletItem = this.items[bulletId];
							let damageMult = 1;
							if (bulletItem._props.ammoType === "buckshot") {
								damageMult = item._props.buckshotBullets
							}
							this.addToName(itemID, ` (${bulletItem._props.Damage * damageMult}/${bulletItem._props.PenetrationPower})`, "append")
						}
					}
				}

				// if (config.FleaAbusePatch.enabled) {
				// 	if (fleaPrice * this.ragfairConfig.dynamic.price.min < traderPrice && !isBanned) {
				// 		// Ignore banned items for compatibility with Softcore mod.
				// 		// log(name)
				// 		const fleaPriceFix = Math.round(traderPrice * (1 / this.ragfairConfig.dynamic.price.min + 0.01))
				// 		this.fleaPrices[itemID] = fleaPriceFix
				// 		fleaPrice = fleaPriceFix
				// 	}
				// }

				// biome-ignore lint/suspicious/noConfusingLabels: bypassAmmoRecolor and bypassKeysRecolor
				rarityRecolor: if (config.RarityRecolor.enabled && !config.RarityRecolorBlacklist.includes(item._parent)) {
					// item._props.BackgroundColor = "grey"

					if (config.RarityRecolor.bypassAmmoRecolor && item._parent === BaseClasses.AMMO) {
						break rarityRecolor
					}

					if (config.RarityRecolor.bypassKeysRecolor && (item._parent === BaseClasses.KEY_MECHANICAL || item._parent === BaseClasses.KEYCARD)) {
						break rarityRecolor
					}

					for (const customItem in config.RarityRecolor.customRarity) {
						if (customItem === itemID) {
							itemRarity = config.RarityRecolor.customRarity[customItem]
						}
					}

					if (itemRarity === 7) {
						tier = i18n.OVERPOWERED
						item._props.BackgroundColor = tiers.OVERPOWERED
						// log(`${itemID} | ${this.getItemName(itemID)}`)
					} else if (itemRarity === 1) {
						tier = i18n.COMMON
						item._props.BackgroundColor = tiers.COMMON
					} else if (itemRarity === 2) {
						tier = i18n.RARE
						item._props.BackgroundColor = tiers.RARE
					} else if (itemRarity === 3) {
						tier = i18n.EPIC
						item._props.BackgroundColor = tiers.EPIC
					} else if (itemRarity === 4) {
						tier = i18n.LEGENDARY
						item._props.BackgroundColor = tiers.LEGENDARY
					} else if (itemRarity === 5) {
						tier = i18n.UBER
						item._props.BackgroundColor = tiers.UBER
					} else if (itemRarity === 6) {
						// can get 6 from custom rules only
						tier = i18n.UNOBTAINIUM
						item._props.BackgroundColor = tiers.UNOBTAINIUM
					} else if (itemRarity === 8) {
						// 8 is for custom dim red background
						tier = i18n.CUSTOM
						item._props.BackgroundColor = tiers.CUSTOM
					} else if (itemRarity >= 9) {
						// 8 is for custom dim orange background
						tier = i18n.CUSTOM2
						item._props.BackgroundColor = tiers.CUSTOM2
					}

					if (config.RarityRecolor.fallbackValueBasedRecolor && itemRarity === 0) {
						let itemValue = itemInHandbook.Price

						const itemSlots = item._props.Width * item._props.Height
						if (itemSlots > 1) {
							itemValue = Math.round(itemValue / itemSlots)
						}
						// log(`"${itemID}", // ${name}, ${item._props.BackgroundColor}, ${itemValue}`)

						if (item._parent === "543be5cb4bdc2deb348b4568") {
							// Ammo boxes special case
							const count = item._props.StackSlots[0]._max_count
							const ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]
							const value = this.getItemInHandbook(ammo).Price
							itemValue = value * count
						}

						// TODO: This will generate non-user friendly errors if they f*ck up their config. Maybe needs manual validation to ensure that all tiers.X values are numbers?
						if (itemValue < Number.parseInt(tiers.COMMON_VALUE_FALLBACK)) {
							tier = i18n.COMMON
							item._props.BackgroundColor = tiers.COMMON
						} else if (itemValue < Number.parseInt(tiers.RARE_VALUE_FALLBACK)) {
							tier = i18n.RARE
							item._props.BackgroundColor = tiers.RARE
						} else if (itemValue < Number.parseInt(tiers.EPIC_VALUE_FALLBACK)) {
							tier = i18n.EPIC
							item._props.BackgroundColor = tiers.EPIC
						} else if (itemValue < Number.parseInt(tiers.LEGENDARY_VALUE_FALLBACK)) {
							tier = i18n.LEGENDARY
							item._props.BackgroundColor = tiers.LEGENDARY
						} else if (itemValue < Number.parseInt(tiers.UBER_VALUE_FALLBACK)) {
							tier = i18n.UBER
							item._props.BackgroundColor = tiers.UBER
						} else {
							// log(`"${itemID}", // ${name}, ${item._props.BackgroundColor}, ${itemValue}`)
							tier = i18n.UNOBTAINIUM
							item._props.BackgroundColor = tiers.UNOBTAINIUM
						}
					}

					if (config.RarityRecolor.addTierNameToPricesInfo) {
						if (tier?.length > 0) {
							priceString += `${tier} | `
						}
					}
				}

				if (config.ArmorInfo.enabled) {
					if (Number(item._props.armorClass) > 0) {
						const armor = this.armors[item._props.ArmorMaterial]
						// prettier-ignore
						armorDurabilityString += `${config.ArmorInfo.addArmorClassInfo ? `${i18n.Armorclass}: ${item._props?.armorClass} | ` : ""}${i18n.Effectivedurability}: ${Math.round(item._props?.MaxDurability / armor?.Destructibility)} (${i18n.Max}: ${Math.round(item._props?.MaxDurability)} x ${this.locales[userLocale][`Mat${(item._props?.ArmorMaterial)}`]}: ${roundWithPrecision(1 / armor?.Destructibility, 1)}) | ${i18n.Repairdegradation}: ${Math.round(armor?.MinRepairDegradation * 100)}% - ${Math.round(armor?.MaxRepairDegradation * 100)}%${newLine + newLine}`;

						if (config.ArmorInfo.addArmorToName) {
							this.addToName(itemID, ` (${item._props?.armorClass}/${Math.round(item._props?.MaxDurability / armor?.Destructibility)})`, "append")
						}

						if (config.ArmorInfo.addArmorToShortName) {
							this.addToShortName(itemID, `${item._props?.armorClass}/${Math.round(item._props?.MaxDurability / armor?.Destructibility)} `, "prepend")
						}

						// log(name)
						// log(armorDurabilityString)
					}
				}

				if (config.AdvancedAmmoInfo.enabled) {
					if (item._parent === "5485a8684bdc2da71d8b4567") {
						const ammoProps = item._props

						// welcome to JS hell.
						advancedAmmoInfoString = `Damage: ${ammoProps.Damage}
Penetration Power: ${ammoProps.PenetrationPower}
Armor Damage: ${ammoProps.ArmorDamage}${
							ammoProps.ProjectileCount > 1
								? `
Projectile Count: ${ammoProps.ProjectileCount}`
								: ""
						}${
							ammoProps.buckshotBullets
								? `
Buckshot Bullets: ${ammoProps.buckshotBullets}`
								: ""
						}
Initial Speed: ${ammoProps.InitialSpeed}
Speed Retardation: ${ammoProps.SpeedRetardation}
Ballistic Coeficient: ${ammoProps.BallisticCoeficient}
Ammo Tooltip Class: ${ammoProps.AmmoTooltipClass}
Fragmentation Chance: ${Math.round(ammoProps.FragmentationChance * 100)}%${
							ammoProps.MaxFragmentsCount > 1
								? `
Min Fragments Count: ${ammoProps.MinFragmentsCount}
Max Fragments Count: ${ammoProps.MaxFragmentsCount}`
								: ""
						}
Ricochet Chance: ${Math.round(ammoProps.RicochetChance * 100)}%
Misfire Chance: ${Math.round(ammoProps.MisfireChance * 100)}%
Malf Feed Chance: ${Math.round(ammoProps.MalfFeedChance * 100)}%
Malf Misfire Chance: ${Math.round(ammoProps.MalfMisfireChance * 100)}%
Durability Burn Modificator: ${ammoProps.DurabilityBurnModificator}
Heat Factor: ${ammoProps.HeatFactor}
Heavy Bleeding Delta: ${ammoProps.HeavyBleedingDelta}
Light Bleeding Delta: ${ammoProps.LightBleedingDelta}
Stamina Burn Per Damage: ${ammoProps.StaminaBurnPerDamage}
${
	ammoProps.Tracer
		? `Tracer: Yes
Tracer Color: ${ammoProps.TracerColor}
Tracer Distance: ${ammoProps.TracerDistance}`
		: "Tracer: No"
}
Penetration Chance Obstacle: ${ammoProps.PenetrationChanceObstacle}
Penetration Damage Mod: ${ammoProps.PenetrationDamageMod}
Penetration Power Diviation: ${ammoProps.PenetrationPowerDiviation}
Accr(?): ${ammoProps.ammoAccr}
Dist(?): ${ammoProps.ammoDist}
Hear(?): ${ammoProps.ammoHear}
Rec(?): ${ammoProps.ammoRec}
Shift Chance(?): ${ammoProps.ammoShiftChance}${
							ammoProps.ExplosionStrength
								? `
Explosion Strength: ${ammoProps.ExplosionStrength}
Max Explosion Distance: ${ammoProps.MaxExplosionDistance}
Explosion Type: ${ammoProps.ExplosionType}
HasGrenaderComponent: ${ammoProps.HasGrenaderComponent}`
								: ""
						}
Bullet Mass Gram: ${ammoProps.BulletMassGram}
Bullet Diameter Milimeters: ${ammoProps.BulletDiameterMilimeters}
Weight: ${ammoProps.Weight}

`
					}
				}

				if (config.ContainerInfo.enabled) {
					if (item._props.Grids?.length > 0) {
						let totalSlots = 0
						for (const grid of item._props.Grids) {
							totalSlots += grid._props.cellsH * grid._props.cellsV
						}
						const slotefficiency = roundWithPrecision(totalSlots / (item._props.Width * item._props.Height), 2)
						// prettier-ignore
						slotefficiencyString += `${i18n.Slotefficiency}: ×${slotefficiency} (${totalSlots}/${item._props.Width * item._props.Height})${newLine + newLine}`;
						// log(name)
						// log(slotefficiencyString)
					}
				}

				if (config.MarkValueableItems.enabled) {
					if (config.SoftcoreAmmoStackMultiFix.enabled && this.itemHelper.isOfBaseclass(itemID, BaseClasses.AMMO) && item._props.StackMaxSize > 1) {
						slotDensity *= 10
						// log(`${this.getItemName(itemID)}, ${slotDensity}`)
					}
					const itemvalue = traderPrice / slotDensity

					let fleaValue
					if (isBanned) {
						// For banned items, recalculate flea price.
						fleaValue = this.getFleaPrice(itemID) / slotDensity

						if (config.MarkValueableItems.alwaysMarkBannedItems) {
							// log(`${itemID} | ${this.getItemName(itemID)}, ${itemvalue}, ${fleaValue}`)
							fleaValue = config.MarkValueableItems.fleaSlotValueThresholdBest + 1 // always mark flea banned items as best.
							// log(`New value ${fleaValue}`)
						}
					} else {
						fleaValue = fleaPrice / slotDensity
					}

					if (this.items[itemID]._parent !== "5795f317245977243854e041") {
						// ignore containers
						if (itemvalue > config.MarkValueableItems.traderSlotValueThresholdBest || fleaValue > config.MarkValueableItems.fleaSlotValueThresholdBest) {
							if (userLocale === "jp" || userLocale === "kr" || config.MarkValueableItems.useAltValueMarks) {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.AltBestValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.AltBestValueMark, "append")
								}
							} else {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.BestValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.BestValueMark, "append")
									// log(`${itemID} | ${this.getItemName(itemID, "ru")}, ${itemvalue}, ${fleaValue}`)
								}
							}
						} else if (itemvalue > config.MarkValueableItems.traderSlotValueThresholdGood || fleaValue > config.MarkValueableItems.fleaSlotValueThresholdGood) {
							if (userLocale === "jp" || userLocale === "kr" || config.MarkValueableItems.useAltValueMarks) {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.AltGoodValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.AltGoodValueMark, "append")
								}
							} else {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.GoodValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.GoodValueMark, "append")
								}
							}
						}
					}
				}

				if (config.PricesInfo.enabled) {
					priceString += `${
						(config.PricesInfo.addFleaPrice ? `${i18n.Fleaprice}: ${this.formatPrice(fleaPrice)}${fleaPrice > 0 ? "₽" : ""} | ` : "") +
						(config.PricesInfo.addItemValue ? `${i18n.ItemValue}: ${this.formatPrice(itemInHandbook.Price)} | ` : "") +
						i18n.Valuation1 +
						traderName +
						i18n.Valuation2
					}: ${this.formatPrice(traderPrice)}₽${newLine + newLine}`

					// log(priceString)
				}

				if (config.HeadsetInfo.enabled) {
					if (item._props.Distortion !== undefined) {
						const gain = item._props.CompressorGain
						const thresh = item._props.CompressorThreshold
						// prettier-ignore
						// headsetDescription = `${i18n.AmbientVolume}: ${item._props.AmbientCompressorSendLevel+10}dB | ${i18n.Compressor}: ${i18n.Gain} +${gain}dB × ${i18n.Treshold} ${thresh}dB ≈ ×${Math.abs((gain * (thresh+20)) / 10)} ${i18n.Boost} | ${i18n.ResonanceFilter}: ${item._props.HighpassResonance}@${item._props.HighpassFreq}Hz | ${i18n.Distortion}: ${Math.round(item._props.Distortion * 100)}%` + newLine + newLine;
						headsetDescription = `${i18n.AmbientVolume}: ${Math.round((item._props.AmbientCompressorSendLevel+10 + item._props.EnvCommonCompressorSendLevel+7 + item._props.EnvNatureCompressorSendLevel+5 + item._props.EnvTechnicalCompressorSendLevel+7) * 10)/10}dB | ${i18n.Boost}: +${((gain + Math.abs(thresh+20)))}dB${item._props.Distortion ? ` | ${i18n.Distortion}: ${Math.round(item._props.Distortion * 100)}%` : ""}${newLine + newLine}`;

						// 						const headsetststs =
						// 							`AmbientCompressorSendLevel: ${item._props.AmbientCompressorSendLevel}dB
						// AmbientVolume: ${item._props.AmbientVolume}dB
						// CompressorAttack: ${item._props.CompressorAttack}ms
						// CompressorGain: ${item._props.CompressorGain}dB
						// CompressorRelease: ${item._props.CompressorRelease}ms
						// CompressorThreshold: ${item._props.CompressorThreshold}dB
						// Distortion: ${item._props.Distortion * 100}%
						// DryVolume: ${item._props.DryVolume}dB
						// EffectsReturnsCompressorSendLevel: ${item._props.EffectsReturnsCompressorSendLevel}dB
						// EffectsReturnsGroupVolume: ${item._props.EffectsReturnsGroupVolume}dB
						// EnvCommonCompressorSendLevel: ${item._props.EnvCommonCompressorSendLevel}dB
						// EnvNatureCompressorSendLevel: ${item._props.EnvNatureCompressorSendLevel}dB
						// EnvTechnicalCompressorSendLevel: ${item._props.EnvTechnicalCompressorSendLevel}dB
						// GunsCompressorSendLevel: ${item._props.GunsCompressorSendLevel}dB
						// HeadphonesMixerVolume: ${item._props.HeadphonesMixerVolume}dB
						// HighpassFreq: ${item._props.HighpassFreq}dB
						// HighpassResonance: ${item._props.HighpassResonance}dB
						// LowpassFreq: ${item._props.LowpassFreq}dB
						// NpcCompressorSendLevel: ${item._props.NpcCompressorSendLevel}dB
						// ObservedPlayerCompressorSendLevel: ${item._props.ObservedPlayerCompressorSendLevel}dB
						// RolloffMultiplier: ${item._props.RolloffMultiplier}dB
						// 						` +
						// 							newLine +
						// 							newLine

						// log(this.getItemName(itemID))
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
					const productionInfo = this.productionGenarator(itemID, userLocale)
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
					headsetDescription +
					armorDurabilityString +
					slotefficiencyString +
					usedForQuestsString +
					usedForHideoutString +
					barterString +
					productionString +
					usedForCraftingString +
					usedForBarterString +
					advancedAmmoInfoString

				this.addToDescription(itemID, descriptionString, "prepend")

				const debug = false
				if (debug) {
					log(this.getItemName(itemID, userLocale))
					log(descriptionString)
					// log(this.getItemDescription(itemID, userLocale))
					log("---")
				}

				if (false) {
					// ORM GEN
					if (item._props.Ergonomics || item._props.Recoil || item._props.Accuracy) {
						const originalStats = `Ergo: ${item._props.Ergonomics} | Recoil: ${item._props.Recoil} | Accuracy: ${item._props.Accuracy} | Weight: ${item._props.Weight} | Tier: ${itemRarity}`
						const aa =
							`// ------------------ ${this.getItemName(itemID)} | ${this.getItemShortName(itemID)} ------------------ \n${originalStats}\n${descriptionString}`
								.replaceAll(/^\s*[\r\n]/gm, "")
								.replaceAll(/\n/g, "\n//")
								.replaceAll(/\n\/\/$/g, "") + newLine
						function genPatch() {
							let oo = "//\n"
							if (item._props.Ergonomics) {
								oo += `// items["${itemID}"]._props.Ergonomics = ${item._props.Ergonomics}\n`
							}
							if (item._props.Recoil) {
								oo += `// items["${itemID}"]._props.Recoil = ${item._props.Recoil}\n`
							}
							if (item._props.Accuracy) {
								oo += `// items["${itemID}"]._props.Accuracy = ${item._props.Accuracy}\n`
							}
							oo += "//\n"
							return oo
						}
						// log(this.getItemName(itemID, userLocale))
						this.ORMGen[item._parent] ??= []
						// this.ORMGen[item._parent][itemID] ??= []
						this.ORMGen[item._parent].push(aa + newLine + genPatch())
					}
				}
				// this.addToName(itemID, "✅✓✔☑🗸⍻√❎❌✖✗✘☒", "append");
			}
		}

		if (false) {
			function compareNumbers(a, b) {
				return parse(a) - parse(b)
			}
			function parse(i) {
				const regex = /Tier: (\d+)/g
				for (const match of i.matchAll(regex)) {
					// log(match[1])
					return match[1]
				}
			}
			for (const parent in this.ORMGen) {
				log(`\n// ------------- ${this.getItemName(parent)} -------------\n`)
				this.ORMGen[parent].sort(compareNumbers).forEach((x) => log(x))
			}
		}

		this.logger.success("[Item Info] Finished processing items, enjoy!")
		if (translations.debug.enabled) {
			const debugItemIDlist = [
				"590a3efd86f77437d351a25b",
				"5c0e722886f7740458316a57",
				"5645bcc04bdc2d363b8b4572",
				"590c621186f774138d11ea29",
				"59faff1d86f7746c51718c9c",
				"5c0e625a86f7742d77340f62",
				"5bb20dcad4351e3bac1212da",
			]
			for (const debugItemID of debugItemIDlist) {
				this.logger.info("---")
				this.logger.info(newLine)
				this.logger.info(debugItemID)
				this.logger.info(this.getItemName(debugItemID, translations.debug.languageToDebug))
				this.logger.info(newLine)
				this.logger.info(this.getItemShortName(debugItemID, translations.debug.languageToDebug))
				this.logger.info(newLine)
				this.logger.info(this.getItemDescription(debugItemID, translations.debug.languageToDebug))
			}
		}
	}

	getItemName(itemID: string, locale = "en"): string {
		if (typeof this.locales[locale][`${itemID} Name`] !== "undefined") {
			return this.locales[locale][`${itemID} Name`]
		} else if (typeof this.locales["en"][`${itemID} Name`] !== "undefined") {
			return this.locales["en"][`${itemID} Name`]
		} else if (typeof this.items[itemID]?._props?.Name !== "undefined") {
			return this.items[itemID]._props.Name // If THIS fails, the modmaker REALLY fucked up
		} else {
			return
		}
	}

	getItemShortName(itemID: string, locale = "en"): string {
		if (typeof this.locales[locale][`${itemID} ShortName`] !== "undefined") {
			return this.locales[locale][`${itemID} ShortName`]
		} else if (typeof this.locales["en"][`${itemID} ShortName`] !== "undefined") {
			return this.locales["en"][`${itemID} ShortName`]
		} else {
			return this.items[itemID]._props.ShortName
		}
	}

	getItemDescription(itemID: string, locale = "en"): string {
		if (typeof this.locales[locale][`${itemID} Description`] !== "undefined") {
			return this.locales[locale][`${itemID} Description`]
		} else if (typeof this.locales["en"][`${itemID} Description`] !== "undefined") {
			return this.locales["en"][`${itemID} Description`]
		} else {
			return this.items[itemID]._props.Description
		}
	}

	formatPrice(price: number): string {
		if (typeof price === "number" && config.FormatPrice) {
			return Intl.NumberFormat("en-US").format(price)
		} else {
			return price.toString()
		}
	}

	addToName(itemID: string, addToName: string, place: "prepend" | "append", lang = ""): void {
		if (lang === "") {
			// I'm actually really proud of this one! If no lang argument is passed, it defaults to recursion for all languages.
			for (const locale in this.locales) {
				this.addToName(itemID, addToName, place, locale)
			}
		} else {
			const originalName = this.getItemName(itemID, lang)
			switch (place) {
				case "prepend":
					this.locales[lang][`${itemID} Name`] = addToName + originalName
					break
				case "append":
					this.locales[lang][`${itemID} Name`] = originalName + addToName
					break
			}
		}
	}

	addToShortName(itemID: string, addToShortName: string, place: "prepend" | "append", lang = ""): void {
		if (lang === "") {
			for (const locale in this.locales) {
				this.addToShortName(itemID, addToShortName, place, locale)
			}
		} else {
			const originalShortName = this.getItemShortName(itemID, lang)
			switch (place) {
				case "prepend":
					this.locales[lang][`${itemID} ShortName`] = addToShortName + originalShortName
					break
				case "append":
					this.locales[lang][`${itemID} ShortName`] = originalShortName + addToShortName
					break
			}
		}
	}

	addToDescription(itemID: string, addToDescription: string, place: "prepend" | "append", lang = ""): void {
		if (lang === "") {
			for (const locale in this.locales) {
				this.addToDescription(itemID, addToDescription, place, locale)
			}
		} else {
			const originalDescription = this.getItemDescription(itemID, lang)
			switch (place) {
				case "prepend":
					this.locales[lang][`${itemID} Description`] = addToDescription + originalDescription
					break
				case "append":
					this.locales[lang][`${itemID} Description`] = originalDescription + addToDescription
					break
			}
		}
	}

	getItemSlotDensity(itemID: string): number {
		return (this.items[itemID]._props.Width * this.items[itemID]._props.Height) / this.items[itemID]._props.StackMaxSize
	}

	getItemInHandbook(itemID: string): IHandbookItem {
		try {
			return this.handbook.Items.find((i) => i.Id === itemID) // Outs: @Id, @ParentId, @Price
		} catch (error) {
			log(error)
		}
	}

	resolveBestTrader(itemID: string, locale = "en") {
		let traderMulti = 0 // AVG fallback
		let traderName = "None"
		// let itemParentID = this.items[itemID]._parent // Unused
		const itemBaseClasses = this.itemBaseClassService.getItemBaseClasses(itemID)
		// log(itemBaseClasses)
		// let handbookCategories = handbook.Categories.filter((i) => i.Id === handbookParentId)[0]

		// traderSellCategory = handbookCategories?.Id // "?" check is for shitty custom items
		// altTraderSellCategory = handbookCategories?.ParentId

		for (const trader of this.traderList) {
			if (
				(trader.base.items_buy.category.some((x) => itemBaseClasses.includes(x)) || trader.base.items_buy.id_list.includes(itemID)) &&
				!trader.base.items_buy_prohibited.id_list.includes(itemID)
			) {
				// items_buy is new to 350 it seems
				traderMulti = (100 - trader.base.loyaltyLevels[0].buy_price_coef) / 100
				//traderName = traderList[i].base.nickname
				traderName = this.locales[locale][`${trader.base._id} Nickname`]
				// log(`${this.getItemName(itemID)} @ ${traderName}`)
				return {
					multi: traderMulti,
					name: traderName,
				}
			}
		}

		return {
			multi: traderMulti,
			name: traderName,
		}
	}

	getItemBestTrader(itemID: string, locale = "en") {
		const handbookItem = this.getItemInHandbook(itemID)

		// log(handbookItem)
		const bestTrader = this.resolveBestTrader(itemID, locale)
		const result = handbookItem.Price * bestTrader.multi
		return {
			price: result,
			name: bestTrader.name,
			ParentId: handbookItem.ParentId,
		}
	}

	getFleaPrice(itemID: string): number {
		if (typeof this.fleaPrices[itemID] !== "undefined") {
			// Forgot quotes, typeof returns string..
			return this.fleaPrices[itemID]
		} else if (typeof this.getItemInHandbook(itemID)?.Price !== "undefined") {
			return this.getItemInHandbook(itemID).Price
		} else {
			return 0
		}
	}

	getBestPrice(itemID: string): number {
		if (typeof this.fleaPrices[itemID] !== "undefined") {
			return this.fleaPrices[itemID]
		} else {
			return this.getItemBestTrader(itemID).price
		}
	}

	bartersResolver(itemID: string): ResolvedBarter[] {
		const itemBarters: ResolvedBarter[] = []

		try {
			this.traderList.forEach((trader) => {
				const allTraderBarters = trader.assort.items
				const traderBarters = allTraderBarters.filter((x) => x._tpl === itemID)

				const barters = traderBarters
					.map((barter) => recursion(barter)) // find and get list of "parent items" for a passed component
					.map((barter) => ({
						// reset parentItem for actual parent items because of recursion function.
						// can be done in a more elegant way, but i'm too tired after a night of debugging. who cares anyway, it works.
						parentItem: barter.originalItemID ? (barter.originalItemID === itemID ? null : barter.originalItemID) : null,
						barterResources: trader.assort.barter_scheme[barter._id][0],
						barterLoyaltyLevel: trader.assort.loyal_level_items[barter._id],
						traderID: trader.base._id,
						barterID: barter._id,
					}))

				itemBarters.push(...barters)

				function recursion(barter: PlaceholderItem): PlaceholderItem {
					if (barter.parentId === "hideout") {
						return barter
					} else {
						let parentBarter
						try {
							// spent literary 12 hours debugging this feature... KMP.
							// all because of one item, SWORD International Mk-18 not having proper .parentId is assort table. who would have thought. thx Nikita
							parentBarter = allTraderBarters.find((x) => x._id === barter.parentId)
							parentBarter.originalItemID = parentBarter._tpl
						} catch (error) {
							return barter // FML
						}
						return recursion(parentBarter)
					}
				}
			})
		} catch (error) {
			this.logger.warning("\n[ItemInfo] bartersResolver failed because of another mod. Send bug report. Continue safely.")
			log(error)
		}

		return itemBarters
	}

	barterInfoGenerator(itemBarters: ResolvedBarter[], locale = "en") {
		let barterString = ""
		const rarityArray = []
		const prices = []

		for (const barter of itemBarters) {
			let totalBarterPrice = 0
			let totalBarterPriceString = ""
			const traderName = this.locales[locale][`${barter.traderID} Nickname`]
			let partOf = ""

			if (barter.parentItem != null) {
				partOf = ` ∈ ${this.getItemShortName(barter.parentItem, locale)}`
			}

			barterString += `${translations[locale].Bought}${partOf} ${translations[locale].at} ${traderName} ${translations[locale].lv}${barter.barterLoyaltyLevel} < `

			let isBarter = false
			for (const resource of barter.barterResources) {
				if (resource._tpl === "5449016a4bdc2d6f028b456f") {
					const rubles = resource.count
					barterString += `${this.formatPrice(Math.round(rubles))}₽ + `
				} else if (resource._tpl === "569668774bdc2da2298b4568") {
					const euro = resource.count
					barterString += `${this.formatPrice(Math.round(euro))}€ ≈ ${this.formatPrice(Math.round(this.euroRatio * euro))}₽ + `
				} else if (resource._tpl === "5696686a4bdc2da3298b456a") {
					const dollars = resource.count
					barterString += `$${this.formatPrice(Math.round(dollars))} ≈ ${this.formatPrice(Math.round(this.dollarRatio * dollars))}₽ + `
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

			if (totalBarterPrice !== 0) {
				totalBarterPriceString = ` | Σ ≈ ${this.formatPrice(Math.round(totalBarterPrice))}₽`
			}

			barterString = `${barterString.slice(0, barterString.length - 3) + totalBarterPriceString}\n`
		}
		return {
			prices: prices, //TODO
			barters: barterString,
			// rarity: rarityArray.length == 0 ? 0 : Math.min(...rarityArray),
			rarity: rarityArray.length === 0 ? [0] : rarityArray,
		}
	}

	barterResourceInfoGenerator(itemID: string, locale = "en"): string {
		// Refactor this abomination pls
		let baseBarterString = ""
		for (const trader of this.traderList) {
			const traderName = this.locales[locale][`${trader.base._id} Nickname`]
			for (const barterID in trader.assort.barter_scheme) {
				// iterate all seller barters
				for (const srcs in trader.assort.barter_scheme[barterID][0]) {
					if (trader.assort.barter_scheme[barterID][0][srcs]._tpl === itemID) {
						const barterResources = trader.assort.barter_scheme[barterID][0]
						let bartedForItem: string
						let totalBarterPrice = 0
						const barterLoyaltyLevel = trader.assort.loyal_level_items[barterID]

						for (const originalBarter in trader.assort.items) {
							if (trader.assort.items[originalBarter]._id === barterID) {
								bartedForItem = trader.assort.items[originalBarter]._tpl
							}
						}

						baseBarterString += `${translations[locale].Traded} ×${trader.assort.barter_scheme[barterID][0][srcs].count} `
						baseBarterString += `${translations[locale].at} ${traderName} ${translations[locale].lv}${barterLoyaltyLevel} > ${this.getItemName(
							bartedForItem,
							locale
						)}`

						let extendedBarterString = " < … + "
						for (const barterResource in barterResources) {
							totalBarterPrice += this.getFleaPrice(barterResources[barterResource]._tpl) * barterResources[barterResource].count
							if (barterResources[barterResource]._tpl !== itemID) {
								extendedBarterString += this.getItemShortName(barterResources[barterResource]._tpl, locale)
								extendedBarterString += ` ×${barterResources[barterResource].count} + `
							}
						}

						const barterStringToAppend =
							totalBarterPrice !== 0 ? ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(bartedForItem) - totalBarterPrice))}₽` : null

						extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3)
						extendedBarterString += barterStringToAppend
						baseBarterString += extendedBarterString + newLine
					}
				}
			}
		}
		return baseBarterString
	}

	getCraftingAreaName(areaType: number, locale = "en"): string {
		const stringName = `hideout_area_${areaType}_name`
		return this.locales[locale][stringName]
	}

	getCraftingRarity(areaType: number, level: number): number {
		for (const s in this.hideoutAreas[areaType].stages) {
			if (Number.parseInt(s) > 1) {
				return level + 1
			} else {
				return 4
			}
		}
	}

	productionGenarator(itemID: string, locale = "en"): string {
		let craftableString = ""
		const rarityArray = []

		for (const recipeId in this.hideoutProduction.recipes) {
			if (itemID === this.hideoutProduction.recipes[recipeId].endProduct && this.hideoutProduction.recipes[recipeId].areaType !== 21) {
				// Find every recipe for itemid and don't use Christmas Tree crafts
				const recipe = this.hideoutProduction.recipes[recipeId]
				if (recipe.locked && recipe.requirements.every((x) => !Object.hasOwn(x, "questId"))) {
					// blocked recipies
					// log(this.getItemName(itemID))
				} else {
					let componentsString = ""
					let recipeAreaString = this.getCraftingAreaName(recipe.areaType, locale)
					let totalRecipePrice = 0
					let recipeDivision = ""
					let questReq = ""

					for (const requirement of recipe.requirements) {
						if (requirement.type === "Area") {
							recipeAreaString = `${this.getCraftingAreaName(requirement.areaType, locale)} ${translations[locale].lv}${requirement.requiredLevel}`
							rarityArray.push(this.getCraftingRarity(requirement.areaType, requirement.requiredLevel))
						}
						if (requirement.type === "Item") {
							const craftComponentId = requirement.templateId
							const craftComponentCount = requirement.count
							const craftComponentPrice = this.getFleaPrice(craftComponentId)

							componentsString += `${this.getItemShortName(craftComponentId, locale)} ×${craftComponentCount} + `
							totalRecipePrice += craftComponentPrice * craftComponentCount
						}
						if (requirement.type === "Resource") {
							// superwater calculation
							const craftComponentId = requirement.templateId
							const resourceProportion = requirement.resource / this.items[requirement.templateId]._props.Resource
							const craftComponentPrice = this.getFleaPrice(craftComponentId)

							componentsString += `${this.getItemShortName(craftComponentId, locale)} ×${Math.round(resourceProportion * 100)}% + `
							totalRecipePrice += Math.round(craftComponentPrice * resourceProportion)
						}
						if (requirement.type === "QuestComplete") {
							if (this.locales[locale][`${requirement.questId} name`]) {
								questReq = ` (${this.locales[locale][`${requirement.questId} name`]}✔)`
							} else {
								// For empty quests
								// log(this.locales[locale][`${requirement.questId} name`])
							}
						}
					}

					if (recipe.count > 1) {
						recipeDivision = ` ${translations[locale].peritem}`
					}

					componentsString = componentsString.slice(0, componentsString.length - 3)

					if (recipe.endProduct === "59faff1d86f7746c51718c9c") {
						craftableString += `${translations[locale].Crafted} @ ${recipeAreaString}`
						const bitcoinTime = recipe.productionTime
						// prettier-ignore
						craftableString += ` | 1× GPU: ${this.convertTime(this.gpuTime(1, bitcoinTime), locale)}, 10× GPU: ${this.convertTime(this.gpuTime(10, bitcoinTime), locale)}, 25× GPU: ${this.convertTime(this.gpuTime(25, bitcoinTime), locale)}, 50× GPU: ${this.convertTime(this.gpuTime(50, bitcoinTime), locale)}`

						// 					log(`
						// // Base time (x${roundWithPrecision(145000/time, 2)}): ${convertTime(time)}, GPU Boost: x${roundWithPrecision(tables.hideout.settings.gpuBoostRate/0.041225, 2)}
						// // 2× GPU: ${convertTime(gpuTime(2))} x${roundWithPrecision(time/gpuTime(2), 2)}
						// // 10× GPU: ${convertTime(gpuTime(10))} x${roundWithPrecision(time/gpuTime(10), 2)}
						// // 25× GPU: ${convertTime(gpuTime(25))} x${roundWithPrecision(time/gpuTime(25), 2)}
						// // 50× GPU: ${convertTime(gpuTime(50))} x${roundWithPrecision(time/gpuTime(50), 2)}`)
					} else {
						craftableString += `${translations[locale].Crafted} ×${recipe.count} @ ${recipeAreaString}${questReq} < `
						craftableString += `${componentsString} | Σ${recipeDivision} ≈ ${this.formatPrice(Math.round(totalRecipePrice / recipe.count))}₽\n`
					}

					//				function convertTime(time: number, locale = "en"): string {
					//					const hours = Math.trunc(time / 60 / 60)
					//					const minutes = Math.round((time - hours * 60 * 60) / 60)
					//					return `${hours}${this.locales[locale].HOURS} ${minutes}${this.locales[locale].Min}`
					//				}
					//
					//				function gpuTime(gpus: number, time: number): number {
					//					return time / (1 + (gpus - 1) * this.tables.hideout.settings.gpuBoostRate)
					//				}
					// if (fleaPrice > totalRecipePrice/recipe.count) {
					// 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
					// 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + this.GetItemName(id) + " can be crafted at " + recipeAreaString)
					// }
				}
			}
		}
		return craftableString
	}

	convertTime(time: number, locale = "en"): string {
		const hours = Math.trunc(time / 60 / 60)
		const minutes = Math.round((time - hours * 60 * 60) / 60)
		return `${hours}${this.locales[locale].HOURS} ${minutes}${this.locales[locale].Min}`
	}

	gpuTime(gpus: number, time: number): number {
		return time / (1 + (gpus - 1) * this.tables.hideout.settings.gpuBoostRate)
	}

	HideoutInfoGenerator(itemID: string, locale = "en"): string {
		// make it like this
		// const r = data.filter(d => d.courses.every(c => courses.includes(c.id)));

		let hideoutString = ""
		for (const area of this.hideoutAreas) {
			for (const stage in area.stages) {
				for (const requirement of area.stages[stage].requirements) {
					if (requirement.templateId === itemID) {
						hideoutString += `${translations[locale].Need} ×${requirement.count} > ${this.getCraftingAreaName(area.type, locale)} ${
							translations[locale].lv
						}${stage}\n`
					}
				}
			}
		}
		return hideoutString
	}

	CraftingMaterialInfoGenarator(itemID: string, locale = "en"): string {
		let usedForCraftingString = ""
		// let totalCraftingPrice = 0 // Unused
		for (const recipe of this.hideoutProduction.recipes) {
			for (const s in recipe.requirements) {
				if (recipe.requirements[s].templateId === itemID) {
					let usedForCraftingComponentsString = " < … + "
					let recipeAreaString = ""
					let totalRecipePrice = 0
					let questReq = ""

					for (const requirement of recipe.requirements) {
						if (requirement.type === "Area") {
							// prettier-ignore
							recipeAreaString = `${this.getCraftingAreaName(requirement.areaType, locale)} ${translations[locale].lv}${requirement.requiredLevel}`
						}
						if (requirement.type === "Item") {
							const craftComponent = requirement
							if (craftComponent.templateId !== itemID) {
								usedForCraftingComponentsString += `${this.getItemShortName(craftComponent.templateId, locale)} ×${craftComponent.count} + `
							}
							totalRecipePrice += this.getFleaPrice(craftComponent.templateId) * craftComponent.count
						}
						if (requirement.type === "Resource") {
							const craftComponent = requirement
							const resourceProportion = craftComponent.resource / this.items[craftComponent.templateId]._props.Resource
							if (craftComponent.templateId !== itemID) {
								usedForCraftingComponentsString += `${this.getItemShortName(craftComponent.templateId, locale)} ×${Math.round(resourceProportion * 100)}% + `
							}
							totalRecipePrice += Math.round(this.getFleaPrice(craftComponent.templateId) * resourceProportion)
						}
						if (requirement.type === "QuestComplete") {
							questReq = ` (${this.locales[locale][`${requirement.questId} name`]}✔) `
						}
					}
					usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3)
					// prettier-ignore
					usedForCraftingComponentsString += ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(recipe.endProduct) * recipe.count - totalRecipePrice))}₽`
					// prettier-ignore
					usedForCraftingString += `${recipe.requirements[s].type === "Tool" ? translations[locale].Tool : `${translations[locale].Part} ×${recipe.requirements[s].count}`} > ${this.getItemName(recipe.endProduct, locale)} ×${recipe.count}`
					usedForCraftingString += ` @ ${recipeAreaString + questReq + usedForCraftingComponentsString}\n`
				}
			}
		}
		// console.log(hideoutString)
		return usedForCraftingString
	}

	QuestInfoGenerator(itemID: string, locale = "en"): string {
		let questString = ""
		let unlockString = ""
		let partString = ""
		for (const questID in this.quests) {
			const questName = this.locales[locale][`${questID} name`]

			const questConditions = this.quests[questID].conditions.AvailableForFinish

			for (const condition of questConditions) {
				if (condition.conditionType === "HandoverItem" && condition.target.includes(itemID)) {
					const trader = this.quests[questID].traderId
					//let tradeName = tables.traders[trader].base.nickname
					const traderName = this.locales[locale][`${trader} Nickname`]

					// prettier-ignore
					questString += `${translations[locale].Found} ${condition.onlyFoundInRaid ? "(✔) " : ""}×${condition.value} > ${questName} @ ${traderName}\n`
				}
			}
			const questRewards = this.quests[questID].rewards.Started.concat(this.quests[questID].rewards.Success).filter((x) => x.type === "AssortmentUnlock")

			if (questRewards.length > 0) {
				const splitRewardString = this.locales[locale]["AssortmentUnlockReward/Description"].split("{0}")
				for (const results of questRewards) {
					const questGiver = this.quests[questID].traderId
					const trader = results.traderId
					const ll = results.loyaltyLevel
					const traderName = this.locales[locale][`${trader} Nickname`]
					const questGiverName = this.locales[locale][`${questGiver} Nickname`]

					for (const item of results.items) {
						if (item._tpl.includes(itemID)) {
							// prettier-ignore
							// unlockString += `${splitRewardString[0]}${traderName} ${translations[locale].lv}${ll}${splitRewardString[1]} > "${questName}"\n`
							if (item._id !== results.target){
								partString = this.getItemName(results.items.find(x => x._id === results.target)._tpl, locale)
							}
							// prettier-ignore
							unlockString += `↺ "${questName}"${traderName === questGiverName ? "" : ` ${questGiverName}`}✔ @ ${traderName} ${translations[locale].lv}${ll}${partString.length > 0 ? ` ∈ ${partString}` : ""}\n`
							// if (trader == "6617beeaa9cfa777ca915b7c") {
							// 	log(`${this.getItemName(itemID, locale)}:\n${unlockString}`)
							// }
						}
					}
				}
			}
		}
		questString += unlockString
		return questString
	}
}

function roundWithPrecision(num: number, precision: number): number {
	const multiplier = 10 ** precision
	return Math.round(num * multiplier) / multiplier
}

const log = (i) => {
	// for my sanity and convenience
	console.log(i)
}

// A silly solution to some weird recursion logic that adds values to an object that shouldn't have them
interface PlaceholderItem extends IItem {
	originalItemID?: string
}

interface ResolvedBarter {
	parentItem: string
	barterResources: IBarterScheme[]
	barterLoyaltyLevel: number
	traderID: string
}

module.exports = { mod: new ItemInfo() }
