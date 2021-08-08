import * as dotenv from "dotenv";
import { Client, Intents, Message, PartialMessage } from "discord.js";
import { Logger } from "./utils/Logger";
import { GoogleSpreadsheet } from "google-spreadsheet";

dotenv.config();

const creds = {
  client_email: process.env.GOOGLE_ACC_EMAIL!,
  private_key: process.env.GOOGLE_PRIV_KEY!,
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

  // ignore anything not from Raid-Helper
  if (msg.author.id !== "579155972115660803") return;

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[787890111];

  const fields = msg.embeds[0].fields;

  const tankFields = fields.filter((field) => field.value.match(tankRegEx));
  const healerFields = fields.filter((field) => field.value.match(healerRegEx));
  const rangedFields = fields.filter((field) => field.value.match(rangedRegEx));
  const meleeFields = fields.filter((field) => field.value.match(meleeRegEx));
});

client.on("ready", () => {
  Logger.info("Logged in");
});

client.login(process.env.BOT_TOKEN);
