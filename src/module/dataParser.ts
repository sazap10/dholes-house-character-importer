export interface DholesHouseExportData {
  Investigator: Investigator;
}

export interface Investigator {
  Header: Header;
  PersonalDetails: PersonalDetails;
  Characteristics: Characteristics;
  Skills: Skills;
  Talents: null;
  Weapons: Weapons;
  Combat: Combat;
  Backstory: Backstory;
  Possessions: Possessions;
  Cash: Cash;
  Assets: null;
}

export interface Backstory {
  description?: string;
  traits?: string;
  ideology?: string;
  injurues?: string;
  people?: string;
  phobias?: string;
  locations?: string;
  tomes?: string;
  possessions?: string;
  encounters?: string;
}

export interface Cash {
  spending: string;
  cash: string;
  assets: string;
}

export interface Characteristics {
  STR: string;
  DEX: string;
  INT: string;
  CON: string;
  APP: string;
  POW: string;
  SIZ: string;
  EDU: string;
  Move: string;
  Luck: string;
  LuckMax: string;
  Sanity: string;
  SanityStart: string;
  SanityMax: string;
  MagicPts: string;
  MagicPtsMax: string;
  HitPts: string;
  HitPtsMax: string;
  DamageBonus: string;
  Build: string;
  OccupationSkillPoints: string;
  PersonalInterestSkillPoints: string;
}

export interface Combat {
  DamageBonus: string;
  Build: string;
  Dodge: Dodge;
}

export interface Dodge {
  value: string;
  half: string;
  fifth: string;
}

export interface Header {
  Title: string;
  Creator: string;
  CreateDate: string;
  GameName: string;
  GameVersion: string;
  GameType: string;
  Discalimer: string;
  Version: string;
}

export interface PersonalDetails {
  Name: string;
  Occupation: string;
  Archetype: string;
  Gender: string;
  Age: string;
  Birthplace: string;
  Residence: string;
  Portrait: string;
}

export interface Possessions {
  item: Item[];
}

export interface Item {
  description: string;
}

export interface Skills {
  Skill?: Skill[];
}

export interface Skill {
  name: string;
  value: string;
  half: string;
  fifth: string;
  subskill?: string;
  occupation?: string;
}

export interface Weapons {
  weapon?: Weapon[];
}

export interface Weapon {
  name: string;
  skillname: string;
  regular: string;
  hard: string;
  extreme: string;
  damage: string;
  range: string;
  attacks: string;
  ammo: string;
  malf: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toDholesHouseExportData(json: string): DholesHouseExportData {
    return JSON.parse(json);
  }

  public static dholesHouseExportDataToJson(value: DholesHouseExportData): string {
    return JSON.stringify(value);
  }
}
