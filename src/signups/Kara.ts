import { Client, Message, PartialMessage } from "discord.js";
import Container, { Service } from "typedi";
import { RegEx } from "../types/RegEx";
import { SignupHandler } from "../types/SignupHandler";
import { GoogleService } from "../utils/GoogleService";
import "../extensions/embed-field-extensions";
import "../extensions/string-extensions";
import { Logger } from "../utils/Logger";

@Service()
export class Kara implements SignupHandler {
    public run(client: Client): void {
        client.on("messageUpdate", (a, b) => this.onEvent(a, b));
    }

    private async onEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        const gService = Container.get<GoogleService>(GoogleService);

        const msg = await newMessage.fetch();

        // ignore anything not from Raid-Helper and in 10-man sign up channel
        if (msg.author.id !== "579155972115660803" || msg.channelId !== "723276052553662475") return;

        const sheet = gService.doc.sheetsById[1882372540];
        await sheet.loadCells("A4:I25");

        const embed = msg.embeds[0];

        const isWednesday = embed.description?.toLowerCase().includes("wednesday");
        const isSunday = embed.description?.toLowerCase().includes("sunday");

        let start: [x: number, y: number];

        if (isWednesday) start = [0, 3];
        else if (isSunday) start = [5, 3];
        else {
            Logger.error(`KARA: Day not known. Description was:\n${embed.description}`);
            return;
        }

        await gService.clearCells(start, [start[0] + 3, start[1] + 21], sheet);

        const fields = embed.fields;

        const tankFields = fields.filterValueByRegEx(RegEx.TankRegEx);
        const healerFields = fields.filterValueByRegEx(RegEx.HealerRegEx);
        const rangedFields = fields.filterValueByRegEx(RegEx.RangedRegEx);
        const meleeFields = fields.filterValueByRegEx(RegEx.MeleeRegEx);

        const tankPairs = tankFields.getNamesAndColors();
        const healerPairs = healerFields.getNamesAndColors();
        const rangedPairs = rangedFields.getNamesAndColors();
        const meleePairs = meleeFields.getNamesAndColors();

        await gService.updateColumnWithColor(start, tankPairs, sheet);
        await gService.updateColumnWithColor([start[0]+1, start[1]], healerPairs, sheet);
        await gService.updateColumnWithColor([start[0]+2, start[1]], rangedPairs, sheet);
        await gService.updateColumnWithColor([start[0]+3, start[1]], meleePairs, sheet);

        await sheet.saveUpdatedCells();

        Logger.info(`Updated Kara sheet`);
    }
}
