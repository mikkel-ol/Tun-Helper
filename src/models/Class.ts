interface Class {
    type: string;
    spec: string;
    name: string;
}

export interface Warrior extends Class {
    type: "Warrior";
    spec: "Protection" | "Arms" | "Fury";
    name: string;
}

export interface Druid extends Class {
    type: "Druid";
    spec: "Guardian" | "Feral" | "Moonkin" | "Restoration"
    name: string;
}

export interface Paladin extends Class {
    type: "Paladin";
    spec: "Protection" | "Retribution" | "Holy";
    name: string;
}

export interface Warlock extends Class {
    type: "Warlock";
    spec: "Destruction" | "Affliction" | "Demonology";
    name: string;
}

export interface Mage extends Class {
    type: "Mage";
    spec: "Arcane" | "Fire" | "Frost";
    name: string;
}

export interface Rogue extends Class {
    type: "Rogue";
    spec: "Assassination" | "Combat" | "Subtlety";
    name: string;
}

export interface Priest extends Class {
    type: "Priest";
    spec: "Discipline" | "Shadow" | "Holy";
    name: string;
}

export interface Shaman extends Class {
    type: "Shaman";
    spec: "Elemental" | "Enchancement" | "Restoration";
    name: string;
}

export interface Warlock extends Class {
    type: "Warlock";
    spec: "Destruction" | "Affliction" | "Demonology";
    name: string;
}