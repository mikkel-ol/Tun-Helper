import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";
import Container, { Service } from "typedi";
import { RegEx } from "../types/RegEx";
import { SignupHandler } from "../types/SignupHandler";
import { GoogleService } from "../utils/GoogleService";
import "../extensions/embed-field-extensions";
import "../extensions/string-extensions";
import { Logger } from "../utils/Logger";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

@Service()
export class TwentyFiveMan implements SignupHandler {
    readonly topLeftMostIndex = [0, 0];
    readonly offsetBetweenSignups = 20;

    public run(client: Client): void {
        client.on("messageUpdate", (a, b) => this.onEvent(a, b)); // implicit context binding
    }

    private async onEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        const gService = Container.get<GoogleService>(GoogleService);

        const msg = await newMessage.fetch();

        // ignore anything not from Raid-Helper and in raid 1 sign up channel
        if (msg.author.id !== "579155972115660803" || msg.channelId !== "854104235619909712") return;

        // sorted list by dates of all messages in channel by Raid-Helper
        const messages = (await msg.channel.messages.fetch())
            .filter((msg) => msg.author.id === "579155972115660803")
            .map((m) => m)
            .sort((a, b) => this.compareDates(this.getDateFromMessageAsObject(a), this.getDateFromMessageAsObject(b)));

        const sheet = gService.doc.sheetsById[787890111];

        messages.forEach(async (message, i) => {
            let index = [this.topLeftMostIndex[0], i * this.offsetBetweenSignups + this.topLeftMostIndex[1]] as [
                number,
                number
            ];

            await this.updateSheet(index, message, sheet);
            await sheet.saveUpdatedCells();
        });

        Logger.info(`Updated 25-man sheet`);
    }

    private async updateSheet(startingIndex: [number, number], msg: Message, sheet: GoogleSpreadsheetWorksheet) {
        const gService = Container.get<GoogleService>(GoogleService);

        await sheet.loadCells({
            startColumnIndex: startingIndex[0],
            startRowIndex: startingIndex[1],
            endColumnIndex: startingIndex[0] + 4 + 6,
            endRowIndex: startingIndex[1] + 20,
        });

        gService.clearCells(startingIndex, [startingIndex[0] + 3, startingIndex[1] + 19], sheet);

        const date = this.getDateFromMessage(msg);

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

        gService.makeCellSetupTitle(startingIndex, sheet);
        gService.makeCellSignupTitle([startingIndex[0] + 6, startingIndex[1]], sheet);

        gService.makeCellValue([startingIndex[0], startingIndex[1] + 1], date as string, sheet);
        gService.makeCellValue([startingIndex[0] + 6, startingIndex[1] + 1], date as string, sheet);

        gService.makeCellValue([startingIndex[0], startingIndex[1] + 2], title, sheet);
        gService.makeCellValue([startingIndex[0] + 6, startingIndex[1] + 2], title, sheet);

        gService.addRoleHeadlines([startingIndex[0], startingIndex[1] + 3], sheet);
        gService.addRoleHeadlines([startingIndex[0] + 6, startingIndex[1] + 3], sheet);

        gService.updateColumnWithColor([startingIndex[0] + 6, startingIndex[1] + 5], tankPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 7, startingIndex[1] + 5], healerPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 8, startingIndex[1] + 5], rangedPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 9, startingIndex[1] + 5], meleePairs, sheet);
    }

    private getDateFromMessage(msg: Message, asObject?: boolean): string {
        return msg.embeds[0].fields[0].value.split("[")[1].split("]")[0];
    }

    private getDateFromMessageAsObject(msg: Message): Date {
        return new Date(Number(msg.embeds[0].fields[0].value.split(":")[6]) * 1000);
    }

    /** https://expertcodeblog.wordpress.com/2018/03/12/typescript-how-to-compare-two-dates/
     * Compares two Date objects and returns e number value that represents
     * the result:
     * 0 if the two dates are equal.
     * 1 if the first date is greater than second.
     * -1 if the first date is less than second.
     * @param date1 First date object to compare.
     * @param date2 Second date object to compare.
     */
    private compareDates(date1: Date, date2: Date): number {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1);
        let d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;

        // Check if the first is greater than second
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
        else return 1;
    }
}
