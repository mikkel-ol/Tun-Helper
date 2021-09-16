import { GoogleSpreadsheet, GoogleSpreadsheetCell, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Service } from "typedi";
import { ClassColorPair } from "../types/ClassColorPair";
import { Logger } from "./Logger";

@Service()
export class GoogleService {
    public doc!: GoogleSpreadsheet;

    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        const creds = {
            client_email: process.env.TH_GOOGLE_ACC_EMAIL!,
            private_key: process.env.TH_GOOGLE_PRIV_KEY!.replace(/['"]+/g, "").replace(/\\n/gm, "\n"),
        };

        this.doc = new GoogleSpreadsheet(process.env.TH_GOOGLE_SHEET_ID);

        await this.doc.useServiceAccountAuth(creds);
        await this.doc.loadInfo();
    }

    /**
     * Clears cells - CELLS NEED TO BE LOADED
     * @param topLeftIndex Tuple in format [x, y] (x horizontal, y vertical)
     * @param bottomRightIndex Tuple in format [x, y] (x horizontal, y vertical)
     * @param sheet Google Spreadsheet to update
     */
    public clearCells(
        topLeftIndex: [number, number],
        bottomRightIndex: [number, number],
        sheet: GoogleSpreadsheetWorksheet
    ): void {
        let i = 0;
        let j = 0;
        try {
            for (i = 0; i <= bottomRightIndex[0] - topLeftIndex[0]; i += 1) {
                for (j = 0; j <= bottomRightIndex[1] - topLeftIndex[1]; j += 1) {
                    const cell = sheet.getCell(j + topLeftIndex[1], i + topLeftIndex[0]);
                    cell.backgroundColor = { red: 1, green: 1, blue: 1, alpha: 1 };
                    cell.value = "";
                }
            }
        } catch (e) {
            Logger.error(e);
            Logger.error(`Cell was: ${i + topLeftIndex[0]},${j + topLeftIndex[1]}`);
        } finally {
        }
    }

    /**
     * Update column from starting position with values in string array. Continues vertical until all values have been set
     * @param cellIndex Tuple with starting position in format [x, y] (x horizontal, y vertical)
     * @param values Array with string values
     * @param sheet Google Spreadsheet to update
     */
    public updateColumn(cellIndex: [number, number], values: string[], sheet: GoogleSpreadsheetWorksheet): void {
        for (let i = 0; i < values.length; i += 1) {
            const cell = sheet.getCell(i + cellIndex[1], cellIndex[0]);
            cell.value = values[i];
        }
    }

    /**
     * Update column from starting position with values and color in @Pair. Continues vertical until all values have been set
     * @param cellIndex
     * @param pair
     * @param sheet
     */
    public updateColumnWithColor(
        cellIndex: [number, number],
        pair: ClassColorPair[],
        sheet: GoogleSpreadsheetWorksheet
    ) {
        for (let i = 0; i < pair.length; i += 1) {
            const cell = sheet.getCell(i + cellIndex[1], cellIndex[0]);
            cell.backgroundColor = pair[i].color;
            cell.value = pair[i].name!;
        }
    }

    /**
     * 
     * @param cellIndex 
     * @param sheet 
     */
    public makeCellSignupTitle(cellIndex: [number, number], sheet: GoogleSpreadsheetWorksheet): void {
        const cell = sheet.getCell(cellIndex[1], cellIndex[0]);
        cell.backgroundColor = { red: 0.8031496, green: 0.25590551, blue: 0.14566929, alpha: 1 };
        cell.value = "Signup";
    }

    /**
     * 
     * @param cellIndex 
     * @param sheet 
     */
    public makeCellSetupTitle(cellIndex: [number, number], sheet: GoogleSpreadsheetWorksheet): void {
        const cell = sheet.getCell(cellIndex[1], cellIndex[0]);
        cell.backgroundColor = { red: 0.8031496, green: 0.25590551, blue: 0.14566929, alpha: 1 };
        cell.value = "Setup";
    }

    /**
     * 
     * @param cellIndex 
     * @param value 
     * @param sheet 
     */
    public makeCellValue(cellIndex: [number, number], value: string, sheet: GoogleSpreadsheetWorksheet): void {
        const cell = sheet.getCell(cellIndex[1], cellIndex[0]);
        cell.value = value;
    }

    /**
     * 
     * @param cellIndex 
     * @param sheet 
     */
    public addRoleHeadlines(cellIndex: [number, number], sheet: GoogleSpreadsheetWorksheet): void {
        const tankCell = sheet.getCell(cellIndex[1], cellIndex[0]);
        const healerCell = sheet.getCell(cellIndex[1], cellIndex[0] + 1);
        const rangedCell = sheet.getCell(cellIndex[1], cellIndex[0] + 2);
        const meleeCell = sheet.getCell(cellIndex[1], cellIndex[0] + 3);

        tankCell.value = "Tanks";
        healerCell.value = "Healers";
        rangedCell.value = "Ranged";
        meleeCell.value = "Melee";
    }
}
