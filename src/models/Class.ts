export class Class {
    type!: string;
    spec!: string;
    name!: string;
    color?: ClassColor;
}

interface ClassColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export class Warrior implements Class {
    type!: "Warrior";
    spec!: "Protection" | "Arms" | "Fury";
    name!: string;
    color = { red: 0.78039217, green: 0.6117647, blue: 0.46666667, alpha: 1 };
}

export class Druid implements Class {
    type!: "Druid";
    spec!: "Guardian" | "Feral" | "Balance" | "Restoration";
    name!: string;
    color = { red: 1, green: 0.42745098, blue: 0.003921569, alpha: 1 };
}

export class Paladin implements Class {
    type!: "Paladin";
    spec!: "Protection" | "Retribution" | "Holy";
    name!: string;
    color = { red: 0.9607843, green: 0.54901963, blue: 0.7294118, alpha: 1 };
}

export class Warlock implements Class {
    type!: "Warlock";
    spec!: "Destruction" | "Affliction" | "Demonology";
    name!: string;
    color = { red: 0.5803922, green: 0.50980395, blue: 0.7921569, alpha: 1 };
}

export class Mage implements Class {
    type!: "Mage";
    spec!: "Arcane" | "Fire" | "Frost";
    name!: string;
    color = { red: 0.4117647, green: 0.8, blue: 0.9411765, alpha: 1 };
}

export class Rogue implements Class {
    type!: "Rogue";
    spec!: "Assassination" | "Combat" | "Subtlety";
    name!: string;
    color = { red: 1, green: 0.9607843, blue: 0.4117647, alpha: 1 };
}

export class Priest implements Class {
    type!: "Priest";
    spec!: "Discipline" | "Shadow" | "Holy";
    name!: string;
    color = { red: 1, green: 1, blue: 1, alpha: 1 };
}

export class Shaman implements Class {
    type!: "Shaman";
    spec!: "Elemental" | "Enchancement" | "Restoration";
    name!: string;
    color = { red: 0, green: 0.4392157, blue: 0.87058824, alpha: 1 };
}

export class Hunter implements Class {
    type!: "Hunter";
    spec!: "Survival" | "Beast Mastery" | "Marksman";
    name!: string;
    color = { red: 0.67058825, green: 0.83137256, blue: 0.4509804, alpha: 1 };
}
