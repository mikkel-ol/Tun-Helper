export class Class {
    type!: string;
    spec!: string;
    name!: string;
}

export class Warrior implements Class {
    type!: "Warrior";
    spec!: "Protection" | "Arms" | "Fury";
    name!: string;
}

export class Druid implements Class {
    type!: "Druid";
    spec!: "Guardian" | "Feral" | "Balance" | "Restoration";
    name!: string;
}

export class Paladin implements Class {
    type!: "Paladin";
    spec!: "Protection" | "Retribution" | "Holy";
    name!: string;
}

export class Warlock implements Class {
    type!: "Warlock";
    spec!: "Destruction" | "Affliction" | "Demonology";
    name!: string;
}

export class Mage implements Class {
    type!: "Mage";
    spec!: "Arcane" | "Fire" | "Frost";
    name!: string;
}

export class Rogue implements Class {
    type!: "Rogue";
    spec!: "Assassination" | "Combat" | "Subtlety";
    name!: string;
}

export class Priest implements Class {
    type!: "Priest";
    spec!: "Discipline" | "Shadow" | "Holy";
    name!: string;
}

export class Shaman implements Class {
    type!: "Shaman";
    spec!: "Elemental" | "Enchancement" | "Restoration";
    name!: string;
}

export class Hunter implements Class {
    type!: "Hunter";
    spec!: "Survival" | "Beast Mastery" | "Marksman";
    name!: string;
}
