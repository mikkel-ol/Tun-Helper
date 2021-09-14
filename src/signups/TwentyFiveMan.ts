import { Client, Message, PartialMessage } from "discord.js";
import Container, { Service } from "typedi";
import { RegEx } from "../types/RegEx";
import { SignupHandler } from "../types/SignupHandler";
import { GoogleService } from "../utils/GoogleService";
import "../extensions/embed-field-extensions";
import "../extensions/string-extensions";
import { Logger } from "../utils/Logger";

@Service()
export class TwentyFiveMan implements SignupHandler {
    public run(client: Client): void {
        client.on("messageUpdate", this.onEvent);
    }

    private async onEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        const gService = Container.get<GoogleService>(GoogleService);

        const msg = await newMessage.fetch();

        // ignore anything not from Raid-Helper and in raid 1 sign up channel
        if (msg.author.id !== "579155972115660803" || msg.channelId !== "854104235619909712") return;

        const sheet = gService.doc.sheetsById[787890111];
        await sheet.loadCells("G3:K200");

        gService.clearCells([6, 2], [10, 100], sheet);

        const fields = msg.embeds[0].fields;

        console.log(msg);
        

        const title = msg.embeds[0].description
            ?.split(":")
            .filter((ele, index, arr) => index % 2 === 1)
            .filter((ele, index, arr) => index !== 0)
            .map((ele) => (ele === "empty" ? " " : ele))
            .join("")!;

        const date = msg.embeds[0].fields[0].value.split("[")[1].split("]")[0];

        const tankFields = fields.filterValueByRegEx(RegEx.TankRegEx);
        const healerFields = fields.filterValueByRegEx(RegEx.HealerRegEx);
        const rangedFields = fields.filterValueByRegEx(RegEx.RangedRegEx);
        const meleeFields = fields.filterValueByRegEx(RegEx.MeleeRegEx);

        const tankPairs = tankFields.getNamesAndColors();
        const healerPairs = healerFields.getNamesAndColors();
        const rangedPairs = rangedFields.getNamesAndColors();
        const meleePairs = meleeFields.getNamesAndColors();

        gService.addTitle([6, 3], date + ": " + title, sheet);
        gService.updateColumnWithColor([6, 4], tankPairs, sheet);
        gService.updateColumnWithColor([7, 4], healerPairs, sheet);
        gService.updateColumnWithColor([8, 4], rangedPairs, sheet);
        gService.updateColumnWithColor([9, 4], meleePairs, sheet);

        await sheet.saveUpdatedCells();

        Logger.info(`Updated 25-man sheet`);
    }
}
