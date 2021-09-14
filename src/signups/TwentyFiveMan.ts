import { Client, Message, PartialMessage } from "discord.js";
import Container, { Service } from "typedi";
import { RegEx } from "../types/RegEx";
import { SignupHandler } from "../types/SignupHandler";
import { GoogleService } from "../utils/GoogleService";
import "../extensions/embed-field-extensions";
import "../extensions/string-extensions";
import { Logger } from "../utils/Logger";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

interface Signup {
    messageId: string;
    index: [number, number];
}

@Service()
export class TwentyFiveMan implements SignupHandler {
    readonly topLeftMostIndex = [6, 0];
    readonly offsetBetweenSignups = 20;
    readonly signups: Signup[] = [];

    public run(client: Client): void {
        client.on("messageUpdate", (a, b) => this.onEvent(a, b)); // implicit context binding
    }

    private async onEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        const gService = Container.get<GoogleService>(GoogleService);

        const msg = await newMessage.fetch();

        // ignore anything not from Raid-Helper and in raid 1 sign up channel
        if (msg.author.id !== "579155972115660803" || msg.channelId !== "854104235619909712") return;

        const sheet = gService.doc.sheetsById[787890111];
        
        const signup = this.signups.find((ele) => ele.messageId === msg.id);

        if (!signup) {
            // make new signup
            const topLeftIndex = [
                this.topLeftMostIndex[0],
                this.signups.length * this.offsetBetweenSignups + this.topLeftMostIndex[1],
            ] as [number, number];

            this.signups.push({
                messageId: msg.id,
                index: topLeftIndex
            });

            await this.updateSheet(topLeftIndex, msg, sheet);
        } else {
            // modify existing signup
            await this.updateSheet(signup.index, msg, sheet);
        }
        
        Logger.info(`Updated 25-man sheet`);
        await sheet.saveUpdatedCells();
    }

    private async updateSheet(startingIndex: [number, number], msg: Message, sheet: GoogleSpreadsheetWorksheet) {
        const gService = Container.get<GoogleService>(GoogleService);

        await sheet.loadCells({
            startColumnIndex: startingIndex[0],
            startRowIndex: startingIndex[1],
            endColumnIndex: startingIndex[0] + 4,
            endRowIndex: startingIndex[1] + 20,
        });

        gService.clearCells(startingIndex, [startingIndex[0] + 3, startingIndex[1] + 19], sheet);

        const date = msg.embeds[0].fields[0].value.split("[")[1].split("]")[0];

        const title = msg.embeds[0].description
            ?.split(":")
            .filter((ele, index, arr) => index % 2 === 1)
            .filter((ele, index, arr) => index !== 0)
            .map((ele) => (ele === "empty" ? " " : ele))
            .join("")!;

        const fields = msg.embeds[0].fields;

        const tankFields = fields.filterValueByRegEx(RegEx.TankRegEx);
        const healerFields = fields.filterValueByRegEx(RegEx.HealerRegEx);
        const rangedFields = fields.filterValueByRegEx(RegEx.RangedRegEx);
        const meleeFields = fields.filterValueByRegEx(RegEx.MeleeRegEx);

        const tankPairs = tankFields.getNamesAndColors();
        const healerPairs = healerFields.getNamesAndColors();
        const rangedPairs = rangedFields.getNamesAndColors();
        const meleePairs = meleeFields.getNamesAndColors();

        gService.makeCellSignupTitle(startingIndex, sheet);
        gService.makeCellValue([startingIndex[0], startingIndex[1] + 1], date, sheet);
        gService.makeCellValue([startingIndex[0], startingIndex[1] + 2], title, sheet);
        gService.addRoleHeadlines([startingIndex[0], startingIndex[1] + 3], sheet);
        gService.updateColumnWithColor([startingIndex[0], startingIndex[1] + 5], tankPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 1, startingIndex[1] + 5], healerPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 2, startingIndex[1] + 5], rangedPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 3, startingIndex[1] + 5], meleePairs, sheet);
    }
}
