import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import Container, { Service } from "typedi";
import { Class } from "../models/Class";
import { GoogleService } from "../utils/GoogleService";

@Service()
export class Magtheridon {
    constructor() { }

    public async updateSheet(classes: Class[]) {
        const gService = Container.get<GoogleService>(GoogleService);
        const sheet = gService.doc.sheetsById[212306994];

        await sheet.loadCells("A1:R29");

        const mt = classes.find(c => c.name === "Tun");
        const ot = classes.find(c => c.name === "Dorice");

        const warlocks = classes.filter(c => c.type === "Warlock");

        warlocks.forEach((warlock, index) => {
            const cell = sheet.getCell(15 + index, 5);
            cell.value = warlock.name;
        });

        sheet.saveUpdatedCells();
    }
}