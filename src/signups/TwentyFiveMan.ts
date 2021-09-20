import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";
import Container, { Service } from "typedi";
import { RegEx } from "../types/RegEx";
import { SignupHandler } from "../types/SignupHandler";
import { GoogleService } from "../utils/GoogleService";
import "../extensions/embed-field-extensions";
import "../extensions/string-extensions";
import { Logger } from "../utils/Logger";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { DateService } from "../utils/DateService";
import { Mapper } from "../utils/Mapper";
import { Magtheridon } from "../assignments/Magtheridon";

@Service()
export class TwentyFiveMan implements SignupHandler {
    readonly topLeftMostIndex = [6, 0];
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
            .sort((a, b) =>
                DateService.compareDates(
                    DateService.getDateFromMessageAsObject(a),
                    DateService.getDateFromMessageAsObject(b)
                )
            );

        const sheet = gService.doc.sheetsById[787890111];

        await sheet.loadCells({
            startColumnIndex: this.topLeftMostIndex[0],
            startRowIndex: this.topLeftMostIndex[1],
            endColumnIndex: this.topLeftMostIndex[0] + 4,
            endRowIndex: this.topLeftMostIndex[1] + 100
        });
        gService.clearCells(
            [this.topLeftMostIndex[0], this.topLeftMostIndex[1]],
            [this.topLeftMostIndex[0] + 3, this.topLeftMostIndex[1] + 99],
            sheet
        );

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
        // const mag = Container.get<Magtheridon>(Magtheridon);
        // const mapper = Container.get<Mapper>(Mapper);

        await sheet.loadCells({
            startColumnIndex: startingIndex[0],
            startRowIndex: startingIndex[1],
            endColumnIndex: startingIndex[0] + 4 + 6,
            endRowIndex: startingIndex[1] + 20,
        });

        const date = DateService.getDateFromMessage(msg);

        const title = msg.embeds[0].description
            ?.split(":")
            .filter((ele, index, arr) => index % 2 === 1)
            .filter((ele, index, arr) => index !== 0)
            .map((ele) => (ele === "empty" ? " " : ele))
            .join("")!;

        const fields = msg.embeds[0].fields;

        // const classes = mapper.embedFieldsToClasses(fields);

        // mag.updateSheet(classes);

        const tankFields = fields.filterValueByRegEx(RegEx.TankRegEx);
        const healerFields = fields.filterValueByRegEx(RegEx.HealerRegEx);
        const rangedFields = fields.filterValueByRegEx(RegEx.RangedRegEx);
        const meleeFields = fields.filterValueByRegEx(RegEx.MeleeRegEx);

        const tankPairs = tankFields.getNamesAndColors();
        const healerPairs = healerFields.getNamesAndColors();
        const rangedPairs = rangedFields.getNamesAndColors();
        const meleePairs = meleeFields.getNamesAndColors();

        //gService.makeCellSetupTitle(startingIndex, sheet);
        gService.makeCellSignupTitle([startingIndex[0], startingIndex[1]], sheet);

        //gService.makeCellValue([startingIndex[0], startingIndex[1] + 1], date as string, sheet);
        gService.makeCellValue([startingIndex[0], startingIndex[1] + 1], date as string, sheet);

        //gService.makeCellValue([startingIndex[0], startingIndex[1] + 2], title, sheet);
        gService.makeCellValue([startingIndex[0], startingIndex[1] + 2], title, sheet);

        //gService.addRoleHeadlines([startingIndex[0], startingIndex[1] + 3], sheet);
        gService.addRoleHeadlines([startingIndex[0], startingIndex[1] + 3], sheet);

        gService.updateColumnWithColor([startingIndex[0], startingIndex[1] + 5], tankPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 1, startingIndex[1] + 5], healerPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 2, startingIndex[1] + 5], rangedPairs, sheet);
        gService.updateColumnWithColor([startingIndex[0] + 3, startingIndex[1] + 5], meleePairs, sheet);
    }
}
