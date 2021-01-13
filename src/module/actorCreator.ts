import { Convert, DholesHouseExportData, Characteristics, PersonalDetails, Cash, Backstory } from "./dataParser.js";
import itemCreator from "./itemCreator.js";
// import ItemCreator from "./ItemCreator";

class ActorCreator {
  private static _instance: ActorCreator;

  private constructor() {
  }

  public static getInstance(): ActorCreator {
    if (!ActorCreator._instance) ActorCreator._instance = new ActorCreator();
    return ActorCreator._instance;
  }

  /**
   * Returns a foundry friendly structure for the attributes section
   *
   * @param data - object containing the Characteristics
   * @private
   */
  private _makeAttributesStructure(data: Characteristics): object {
    let attribs = {
      hp: {
        value: +data.HitPts,
        max: +data.HitPtsMax,
        short: 'HP',
        label: 'Hit points',
        auto: true
      },
      mp: {
        value: +data.MagicPts,
        max: +data.MagicPtsMax,
        short: 'HP',
        label: 'Magic points',
        auto: true
      },
      lck: {
        value: +data.Luck,
        short: 'LCK',
        label: 'Luck',
        max: +data.LuckMax
      },
      san: {
        value: +data.Sanity,
        max: +data.SanityMax,
        short: 'SAN',
        label: 'Sanity',
        auto: true
      },
      mov: {
        value: +data.Move,
        short: 'MOV',
        label: 'Movement rate',
        auto: true
      },
      build: {
        value: +data.Build,
        short: 'BLD',
        label: 'Build',
        auto: true
      },
      armor: {
        value: '',
        auto: false
      },
      db: {
        value: null,
        short: 'DB',
        label: 'Damage bonus',
        auto: true
      }
    };

    const dbValue = parseInt(data.DamageBonus);

    if (!isNaN(dbValue)) {
      attribs.db.value = dbValue;
    }

    return attribs;
  }

  /**
   * Returns the characteristics structure
   *
   * @param data - object that contains the resources from the parser
   * @private
   */
  private _makeCharacteristicsStructure(data: Characteristics): object {
    return {
      app: {
        "value": +data.APP,
        "short": "CHARAC.APP",
        "label": "CHARAC.Appearance",
        "formula": null
      },
      con: {
        "value": +data.CON,
        "short": "CHARAC.CON",
        "label": "CHARAC.Constitution",
        "formula": null
      },
      dex: {
        "value": +data.DEX,
        "short": "CHARAC.DEX",
        "label": "CHARAC.Dexterity",
        "formula": null
      },
      edu: {
        "value": +data.EDU,
        "short": "CHARAC.EDU",
        "label": "CHARAC.Education",
        "formula": null
      },
      int: {
        "value": +data.INT,
        "short": "CHARAC.INT",
        "label": "CHARAC.Intelligence",
        "formula": null
      },
      pow: {
        "value": +data.POW,
        "short": "CHARAC.POW",
        "label": "CHARAC.Power",
        "formula": null
      },
      siz: {
        "value": +data.SIZ,
        "short": "CHARAC.SIZ",
        "label": "CHARAC.Size",
        "formula": null
      },
      str: {
        "value": +data.STR,
        "short": "CHARAC.STR",
        "label": "CHARAC.Strength",
        "formula": null
      }
    }
  }

  /**
   * Returns the info structure
   *
   * @param data - object that contains the resources from the parser
   * @private
   */
  private _makeInfoStructure(data: PersonalDetails): object {
    return {
      occupation: data.Occupation,
      age: data.Age,
      sex: data.Gender,
      residence: data.Residence,
      birthplace: data.Birthplace,
      archetype: data.Archetype,
      organization: ''
    }

  }

  /**
   * Returns the credit structure
   *
   * @param data - object that contains the resources from the parser
   * @private
   */
  private _makeCreditStructure(data: Cash): object {
    return {
      monetarySymbol: '',
      multiplier: '',
      spent: '',
      assetsDetails: '',
      spendingLevel: data.spending,
      cash: data.cash,
      assets: data.assets
    }
  }

    /**
   * Returns the biography structure
   *
   * @param data - object that contains the resources from the parser
   * @private
   */
  private _makeBiographyStructure(Backstory: Backstory): Array<object> {
    let bio = []
    for (const property in Backstory) {
      bio.push({
        title: property,
        value: Backstory[property]
      })
    }

    return bio
  }

  /**
   * Returns a foundry friendly structure for the data field of the actor
   *
   * @param dholesHouseExportData - an object that contains all the data extracted from the parser
   * @private
   */
  private _makeDataStructure(dholesHouseExportData: DholesHouseExportData): object {
    return {
      characteristics: this._makeCharacteristicsStructure(dholesHouseExportData.Investigator.Characteristics),
      attribs: this._makeAttributesStructure(dholesHouseExportData.Investigator.Characteristics),
      infos: this._makeInfoStructure(dholesHouseExportData.Investigator.PersonalDetails),
      credit: this._makeCreditStructure(dholesHouseExportData.Investigator.Cash),
      biography: this._makeBiographyStructure(dholesHouseExportData.Investigator.Backstory)
    };
  }

  public async actorCreator(text: string) {
    const dholesHouseExportData = Convert.toDholesHouseExportData(text);

    let actor = await Actor.create({
      name: dholesHouseExportData.Investigator.PersonalDetails.Name,
      type: "character",
      img: "",
      sort: 12000,
      data: this._makeDataStructure(dholesHouseExportData),
      token: {},
      items: [],
      flags: {}
    }, { renderSheet: true });

    await itemCreator.addSkills(actor, dholesHouseExportData.Investigator.Skills.Skill, dholesHouseExportData.Investigator.Header.GameType)
    await itemCreator.addWeapons(actor, dholesHouseExportData.Investigator.Weapons.weapon, dholesHouseExportData.Investigator.Header.GameType)
    await itemCreator.addItems(actor, dholesHouseExportData.Investigator.Possessions.item, dholesHouseExportData.Investigator.Header.GameType)
  }

}

export default ActorCreator.getInstance();