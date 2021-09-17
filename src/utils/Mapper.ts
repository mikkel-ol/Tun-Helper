import { EmbedField } from "discord.js";
import { Service } from "typedi";
import { Class } from "../models/Class";

@Service()
export class Mapper {
    embedFieldsToClasses(embeds: EmbedField[]): Class[] {
        const classes = embeds
            .map((field) => field.value)
            .join()
            .split(/\r?\n/)
            .map((s) => (s.indexOf("Bench") === -1 ? s : s.substring(0, s.indexOf("Bench"))))
            .map((s) => (s.indexOf("Late") === -1 ? s : s.substring(0, s.indexOf("Late"))))
            .map((s) => (s.indexOf("Absence") === -1 ? s : s.substring(0, s.indexOf("Absence"))));

        const arr: Class[] = [];

        classes.forEach((c) => {
            const spec = c.split(":")[1];

            switch (spec) {
                case "Protection":
                    arr.push({
                        type: "Warrior",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Arms":
                    arr.push({
                        type: "Warrior",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Fury":
                    arr.push({
                        type: "Warrior",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Restoration":
                    arr.push({
                        type: "Druid",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Guardian":
                    arr.push({
                        type: "Druid",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Feral":
                    arr.push({
                        type: "Druid",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Balance":
                    arr.push({
                        type: "Druid",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Protection1":
                    arr.push({
                        type: "Paladin",
                        spec: "Protection",
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Retribution":
                    arr.push({
                        type: "Paladin",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Holy1":
                    arr.push({
                        type: "Paladin",
                        spec: "Holy",
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Affliction":
                    arr.push({
                        type: "Warlock",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Demonology":
                    arr.push({
                        type: "Warlock",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Destruction":
                    arr.push({
                        type: "Warlock",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Arcane":
                    arr.push({
                        type: "Mage",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Fire":
                    arr.push({
                        type: "Mage",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Frost":
                    arr.push({
                        type: "Mage",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Assassination":
                    arr.push({
                        type: "Rogue",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Combat":
                    arr.push({
                        type: "Rogue",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Subtlety":
                    arr.push({
                        type: "Rogue",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Shadow":
                    arr.push({
                        type: "Priest",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Discipline":
                    arr.push({
                        type: "Priest",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Holy":
                    arr.push({
                        type: "Priest",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Restoration1":
                    arr.push({
                        type: "Shaman",
                        spec: "Restoration",
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Enhancement":
                    arr.push({
                        type: "Shaman",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Elemental":
                    arr.push({
                        type: "Shaman",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Beastmastery":
                    arr.push({
                        type: "Hunter",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Marksman":
                    arr.push({
                        type: "Hunter",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
                case "Survival":
                    arr.push({
                        type: "Hunter",
                        spec,
                        name: c.split(":")[2].split("**")[1],
                    });
                    break;
            }
        });

        return arr;
    }
}
