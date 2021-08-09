import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Service } from "typedi";
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
    public async clearCells(
        topLeftIndex: [number, number],
        bottomRightIndex: [number, number],
        sheet: GoogleSpreadsheetWorksheet
    ): Promise<void> {
        let i = 0;
        let j = 0;
        try {
            for (i = 0; i <= bottomRightIndex[0] - topLeftIndex[0]; i += 1) {
                for (j = 0; j <= bottomRightIndex[1] - topLeftIndex[1]; j += 1) {
                    const cell = await sheet.getCell(j + topLeftIndex[1], i + topLeftIndex[0]);
                    cell.value = "";
                }
            }
        } catch (e) {
            Logger.error(e);
            Logger.error(`Cell was: ${i + topLeftIndex[0]},${j + topLeftIndex[1]}`);
        } finally {}
    }

    /**
     * Update column from starting position with values in string array. Continues vertical until all values have been set
     * @param cellIndex Tuple with starting position in format [x, y] (x horizontal, y vertical)
     * @param values Array with string values
     * @param sheet Google Spreadsheet to update
     */
    public async updateColumn(cellIndex: [number, number], values: string[], sheet: GoogleSpreadsheetWorksheet) {
        for (let i = 0; i < values.length; i += 1) {
            const cell = await sheet.getCell(i + cellIndex[1], cellIndex[0]);
            cell.value = values[i];
        }
    }
}