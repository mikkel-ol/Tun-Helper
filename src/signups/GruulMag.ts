import { Client, Message, PartialMessage } from "discord.js";
import Container, { Service } from "typedi";
import { RegEx } from "../types/RegEx";
import { SignupHandler } from "../types/SignupHandler";
import { GoogleService } from "../utils/GoogleService";
import "../extensions/embed-field-extensions";
import "../extensions/string-extensions";
import { Logger } from "../utils/Logger";

@Service()
export class GruulMag implements SignupHandler {
    public run(client: Client): void {
        client.on("messageUpdate", this.onEvent);
    }

    private async onEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        const gService = Container.get<GoogleService>(GoogleService);

        const msg = await newMessage.fetch();

        // ignore anything not from Raid-Helper and in raid 1 sign up channel
        if (msg.author.id !== "579155972115660803" || msg.channelId !== "854104235619909712") return;

        const sheet = gService.doc.sheetsById[787890111];
        await sheet.loadCells("I2:L17");

        await gService.clearCells([8, 1], [11, 16], sheet);

        const fields = msg.embeds[0].fields;

        const tankFields = fields.filterValueByRegEx(RegEx.TankRegEx);
        const healerFields = fields.filterValueByRegEx(RegEx.HealerRegEx);
        const rangedFields = fields.filterValueByRegEx(RegEx.RangedRegEx);
        const meleeFields = fields.filterValueByRegEx(RegEx.MeleeRegEx);

        const tankPairs = tankFields.getNamesAndColors();
        const healerPairs = healerFields.getNamesAndColors();
        const rangedPairs = rangedFields.getNamesAndColors();
        const meleePairs = meleeFields.getNamesAndColors();

        await gService.updateColumnWithColor([8, 1], tankPairs, sheet);
        await gService.updateColumnWithColor([9, 1], healerPairs, sheet);
        await gService.updateColumnWithColor([10, 1], rangedPairs, sheet);
        await gService.updateColumnWithColor([11, 1], meleePairs, sheet);

        await sheet.saveUpdatedCells();

        Logger.info(`Updated 25-man sheet`);
    }
}
