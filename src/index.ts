import * as dotenv from "dotenv";
import { Client, Intents, Message, PartialMessage } from "discord.js";
import { Logger } from "./utils/Logger";
import { GoogleSpreadsheet } from "google-spreadsheet";

dotenv.config();

const creds = {
  client_email: process.env.TH_GOOGLE_ACC_EMAIL!,
  private_key: process.env.TH_GOOGLE_PRIV_KEY!,
};

const client = new Client({
  partials: ["MESSAGE"],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const tankRegEx = /Protection|Guardian|Protection/g;
const healerRegEx = /Restoration|Holy|Discipline|Holy/g;
const rangedRegEx =
  /Balance|Beastmastery|Marksman|Survival|Arcane|Fire|Frost|Affliction|Demonology|Destruction|Shadow|Elemental/g;
const meleeRegEx =
  /Arms|Fury|Feral|Retribution|Assassination|Combat|Subtlety|Enhancement/g;

client.on("messageUpdate", async (oldMsg, newMsg) => {
  const msg = await newMsg.fetch();

  // ignore anything not from Raid-Helper and in raid 1 sign up channel
  if (
    msg.author.id !== "579155972115660803" ||
    msg.channelId !== "854104235619909712"
  )
    return;

  const doc = new GoogleSpreadsheet(process.env.TH_GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[787890111];
  await sheet.loadCells("I2:L17");

  // clear cells
  for (let i = 0; i < 16; i += 1) {
    // rows
    for (let j = 0; j < 4; j += 1) {
      // columns
      const cell = await sheet.getCell(i + 1, j + 8);
      cell.value = "";
    }
  }

  const fields = msg.embeds[0].fields;

  const tankFields = fields
    .map((field) => field.value)
    .join()
    .split(/\r?\n/)
    .filter((s) => s.match(tankRegEx));
  const healerFields = fields
    .map((field) => field.value)
    .join()
    .split(/\r?\n/)
    .filter((s) => s.match(healerRegEx));
  const rangedFields = fields
    .map((field) => field.value)
    .join()
    .split(/\r?\n/)
    .filter((s) => s.match(rangedRegEx));
  const meleeFields = fields
    .map((field) => field.value)
    .join()
    .split(/\r?\n/)
    .filter((s) => s.match(meleeRegEx));

  const tankNames = tankFields
    .map((field) => field.split("**"))
    .map((arr) => arr[1]);
  const healerNames = healerFields
    .map((field) => field.split("**"))
    .map((arr) => arr[1]);
  const rangedNames = rangedFields
    .map((field) => field.split("**"))
    .map((arr) => arr[1]);
  const meleeNames = meleeFields
    .map((field) => field.split("**"))
    .map((arr) => arr[1]);

  for (let i = 0; i < tankFields.length; i += 1) {
    const cell = await sheet.getCell(i + 1, 8);
    cell.value = tankNames[i];
  }

  for (let i = 0; i < healerFields.length; i += 1) {
    const cell = await sheet.getCell(i + 1, 9);
    cell.value = healerNames[i];
  }

  for (let i = 0; i < rangedFields.length; i += 1) {
    const cell = await sheet.getCell(i + 1, 10);
    cell.value = rangedNames[i];
  }

  for (let i = 0; i < meleeFields.length; i += 1) {
    const cell = await sheet.getCell(i + 1, 11);
    cell.value = meleeNames[i];
  }

  await sheet.saveUpdatedCells();
});

client.on("ready", () => {
  Logger.info("Logged in");
});

client.login(process.env.TH_BOT_TOKEN);
