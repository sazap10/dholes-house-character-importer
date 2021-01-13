import { Skill, Weapon, Item } from "./dataParser";

class ItemCreator {
  private static _instance: ItemCreator;

  private constructor() {
  }

  public static getInstance(): ItemCreator {
    if (!ItemCreator._instance) ItemCreator._instance = new ItemCreator();
    return ItemCreator._instance;
  }

  private _gameTypeToEraMap: { [key: string]: string } = {
    "Classic (1920's)": '1920',
    "Gaslight (1880's)": 'glit',
    'Modern': 'mdrn',
  };

  /**
   * Creates the item to be added to the actor
   *
   * @param actor - actor that is the owner of the item
   * @param skillData - data of the item from the parser
   * @param actorStats - stats of the actor
   */
  private async _skillCreator(actor: any, skillData: Skill, gameSystem: string): Promise<void> {
    let item = {
      name: skillData.subskill ? skillData.subskill : skillData.name,
      type: 'skill',
      data: {
        specialization: skillData.subskill ? skillData.name : '',
        description: {
          value: '',
          opposingDifficulty: '',
          pushedFaillureConsequences: '',
          chat: ''
        },
        base: skillData.value,
        adjustments: {
          personal: null,
          occupation: null,
          archetype: null,
          experience: null
        },
        value: null,
        attributes: {},
        properties: {
          special: skillData.subskill ? true : false,
          rarity: false,
          push: false,
          combat: false,
          fighting: false,
          firearm: false,
          noxpgain: false
        },
        eras: {
          '1920': false,
          nvct: false,
          drka: false,
          ddts: false,
          glit: false,
          pulp: false,
          mdrn: false
        }
      }
    }

    switch (skillData.name) {
      case "Fighting":
        item.data.properties.combat = true;
        item.data.properties.fighting = true;
        break;
      case "Firearms":
        item.data.properties.combat = true;
        item.data.properties.firearm = true;
        break;
      case "Credit Rating":
        item.data.properties.push = true;
        item.data.properties.noxpgain = true;
        break;
      default:
        item.data.properties.push = true;
        break;
    }

    item.data.eras[this._gameTypeToEraMap[gameSystem]] = true

    try {
      await actor.createEmbeddedEntity("OwnedItem", item);
    }
    catch (e) {
      ui.notifications['error'](`There has been an error while creating ${skillData.name}`);
      console.error(e);
    }
  }

  /**
   * Creates the item to be added to the actor
   *
   * @param actor - actor that is the owner of the item
   * @param weaponData - data of the item from the parser
   * @param actorStats - stats of the actor
   */
  private async _weaponCreator(actor: Actor, weaponData: Weapon, gameSystem: string): Promise<void> {
    let item = {
      name: weaponData.name,
      type: 'weapon',
      data: {
        description: {
          value: '',
          chat: '',
          special: ''
        },
        wpnType: '',
        skill: {
          main: {
            name: '',
            id: ''
          },
          alternativ: {
            name: '',
            id: ''
          }
        },
        range: {
          normal: {
            value: 0,
            units: '',
            damage: ''
          },
          'long': {
            value: 0,
            units: '',
            damage: ''
          },
          extreme: {
            value: 0,
            units: '',
            damage: ''
          }
        },
        usesPerRound: {
          normal: '1',
          max: '',
          burst: null
        },
        bullets: '',
        ammo: 0,
        malfunction: '',
        blastRadius: null,
        properties: {
          melee: false,
          rngd: false,
          mnvr: false,
          thrown: false,
          shotgun: false,
          dbrl: false,
          impl: false,
          brst: false,
          auto: false,
          ahdb: false,
          addb: false,
          slnt: false,
          spcl: false,
          mont: false,
          blst: false,
          stun: false,
          rare: false,
          burn: false
        },
        eras: {
          '1920': false,
          nvct: false,
          drka: false,
          ddts: false,
          glit: false,
          pulp: false,
          mdrn: false
        },
        price: {
          mdrn: '0'
        }
      }
    }

    item.data.eras[this._gameTypeToEraMap[gameSystem]] = true

    const skill = actor.items.find(i => i.data.name == weaponData.skillname)

    if (skill) {
      item.data.skill.main.id = skill.id
    }

    if (weaponData.range == "-" || weaponData.range == "Touch") {
      item.data.properties.melee = true
      if (weaponData.malf != "-") {
        item.data.malfunction = weaponData.malf
      }
      const damageList = weaponData.damage.split("+")
      switch (damageList[damageList.length - 1]) {
        case "DB":
        case "db":
          item.data.properties.addb = true
          damageList.splice(-1, 1)
          item.data.range.normal.damage = damageList.join("+")
          break;
        case "half DB":
          item.data.properties.ahdb = true
          damageList.splice(-1, 1)
          item.data.range.normal.damage = damageList.join("+")
          break;
        case "burn":
          item.data.properties.burn = true
          damageList.splice(-1, 1)
          item.data.range.normal.damage = damageList.join("+")
          break;
        default:
          item.data.range.normal.damage = weaponData.damage
          break;
      }
    } else {
      item.data.properties.rngd = true
      item.data.malfunction = weaponData.malf
      const rangeList = weaponData.range.split(" ")
      const unit = rangeList[1]
      const splitRange = rangeList[0].split("/")
      const splitDamage = weaponData.damage.split("/")
      const splitAmmo = weaponData.ammo.split("/")
      // not sure why ammo would require multiple amounts
      // but the MP5 seems to so just taking the first for now
      item.data.bullets = splitAmmo[0]
      item.data.ammo = +splitAmmo[0]

      item.data.range.normal = {
        damage: splitDamage[0],
        units: unit,
        value: +splitRange[0]
      }

      if (splitRange.length > 1 && splitDamage.length > 1) {
        item.data.range.long = {
          damage: splitDamage[1],
          units: unit,
          value: +splitRange[1]
        }
      }

      if (splitRange.length > 2 && splitDamage.length > 2) {
        item.data.range.long = {
          damage: splitDamage[2],
          units: unit,
          value: +splitRange[2]
        }
      }

      const splitAttacks = weaponData.attacks.split(" or ")
      if (splitAttacks.length > 1) {
        if (splitAttacks[1] == "full auto") {
          item.data.properties.auto = true
        } else if (splitAttacks[1].includes("burst")) {
          item.data.properties.brst = true
          const burstAmountMatch = splitAttacks[1].match(/[0-9]+/g)
          if (burstAmountMatch.length == 1) {
            item.data.usesPerRound.burst = burstAmountMatch[0]
          }
        } else if (splitAttacks[1].match(/^[0-9]+$/g).length == 1) {
          const maxUseMatch = splitAttacks[1].match(/^[0-9]+$/g)
          item.data.usesPerRound.max = maxUseMatch[0]
        }
      }

      const attackMatch = splitAttacks[0].match(/([0-9]+(\/[0-9]+)?)( \(([0-9]+)\))/)
      if (attackMatch) {
        item.data.usesPerRound.normal = attackMatch[0]
        if (attackMatch[4]) item.data.usesPerRound.max = attackMatch[4]
      }

      if(weaponData.skillname == "Shotgun") item.data.properties.shotgun = true
    }

    try {
      await actor.createEmbeddedEntity("OwnedItem", item);
    }
    catch (e) {
      ui.notifications['error'](`There has been an error while creating ${weaponData.name}`);
      console.error(e);
    }
  }

  /**
   * Creates the item to be added to the actor
   *
   * @param actor - actor that is the owner of the item
   * @param itemData - data of the item from the parser
   * @param actorStats - stats of the actor
   */
  private async _itemCreator(actor: Actor, itemData: Item, gameSystem: string): Promise<void> {
    let item = {
      name: itemData.description,
      type: "item",
      data: { "description": null, "quantity": 1, "weight": 0, "attributes": {} },
    }

    try {
      await actor.createEmbeddedEntity("OwnedItem", item);
    }
    catch (e) {
      ui.notifications['error'](`There has been an error while creating ${itemData.description}`);
      console.error(e);
    }
  }

  /**
   * Adds all skills to the actor
   *
   * @param actor - owner of the skills
   * @param skills - skills list
   * @param gameSystem - Name of game system eg Gaslight, Modern, 1920s etc
   */
  public async addSkills(actor: any, skills: Array<Skill>, gameSystem: string): Promise<void> {
    for (let skill of skills) {
      await this._skillCreator(actor, skill, gameSystem);
    }
  }

  /**
   * Adds all weapons to the actor
   *
   * @param actor - owner of the skills
   * @param weapons - weapons list
   * @param gameSystem - Name of game system eg Gaslight, Modern, 1920s etc
   */
  public async addWeapons(actor: any, weapons: Array<Weapon>, gameSystem: string): Promise<void> {
    for (let weapon of weapons) {
      await this._weaponCreator(actor, weapon, gameSystem);
    }
  }

  /**
   * Adds all items to the actor
   *
   * @param actor - owner of the skills
   * @param items - items list
   * @param gameSystem - Name of game system eg Gaslight, Modern, 1920s etc
   */
  public async addItems(actor: any, items: Array<Item>, gameSystem: string): Promise<void> {
    for (let item of items) {
      await this._itemCreator(actor, item, gameSystem);
    }
  }

}

export default ItemCreator.getInstance();