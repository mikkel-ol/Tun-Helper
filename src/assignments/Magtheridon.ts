import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import Container, { Service } from "typedi";
import { Class } from "../models/Class";
import { GoogleService } from "../utils/GoogleService";

@Service()
export class Magtheridon {
    sheet!: GoogleSpreadsheetWorksheet;
    classes!: Class[];

    constructor() {}

    public async updateSheet(classes: Class[]) {
        const gService = Container.get<GoogleService>(GoogleService);

        this.sheet = gService.doc.sheetsById[212306994];
        this.classes = classes;

        await this.sheet.loadCells("A1:R29");

        this.setTanks();
        this.setHealers();
        this.setCurseOfTongues();

        this.sheet.saveUpdatedCells();
    }

    private setHealers() {
        const druidHealers = this.classes.filter(c => c.type === "Druid" && c.spec === "Restoration");
        const shamanHealers = this.classes.filter(c => c.type === "Shaman" && c.spec === "Restoration");
        const paladinHealers = this.classes.filter(c => c.type === "Paladin" && c.spec === "Holy");
        const priestHealers = this.classes.filter(c => c.type === "Priest" && c.spec === "Holy");

        let cell = this.sheet.getCell(12, 0);
        cell.value = druidHealers[0]?.name ?? "NONE";
        cell.backgroundColor = druidHealers[0]?.color!;

        cell = this.sheet.getCell(13, 0);
        cell.value = druidHealers[1]?.name ?? "NONE";
        cell.backgroundColor = druidHealers[1]?.color!;

        cell = this.sheet.getCell(14, 0);
        cell.value = shamanHealers[0]?.name ?? "NONE";
        cell.backgroundColor = shamanHealers[0]?.color!;

        cell = this.sheet.getCell(15, 0);
        cell.value = shamanHealers[1]?.name ?? "NONE";
        cell.backgroundColor = shamanHealers[1]?.color!;

        cell = this.sheet.getCell(16, 0);
        cell.value = paladinHealers[0]?.name ?? "NONE";
        cell.backgroundColor = paladinHealers[0]?.color!;        
    }

    private setTanks() {
        const warriorTank = this.classes.find((c) => c.type === "Warrior" && c.spec === "Protection")!;
        const paladinTank = this.classes.find((c) => c.type === "Paladin" && c.spec === "Protection")!;
        const druidTank = this.classes.find((c) => c.type === "Druid" && c.spec === "Guardian")!;

        let cell = this.sheet.getCell(5, 0);
        cell.value = warriorTank.name ?? "NONE";
        cell.backgroundColor = warriorTank?.color!;

        cell = this.sheet.getCell(6, 0);
        cell.value = paladinTank.name ?? "NONE";
        cell.backgroundColor = paladinTank?.color!;

        cell = this.sheet.getCell(7, 0);
        cell.value = druidTank.name ?? "NONE";
        cell.backgroundColor = druidTank?.color!;
    }

    private setCurseOfTongues() {
        const warlocks = this.classes.filter((c) => c.type === "Warlock");

        warlocks.forEach((warlock, index) => {
            const cell = this.sheet.getCell(15 + index, 5);
            cell.value = warlock.name ?? "NONE";
            cell.backgroundColor = warlock?.color!;
        });
    }
}
