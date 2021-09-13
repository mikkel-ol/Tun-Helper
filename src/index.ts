import "reflect-metadata";
import * as dotenv from "dotenv";
import { Client, Intents, Message, PartialMessage } from "discord.js";
import { Logger } from "./utils/Logger";
import Container from "typedi";
import { GoogleService } from "./utils/GoogleService";
import { TwentyFiveMan } from "./signups/TwentyFiveMan";
import { Kara } from "./signups/Kara";

dotenv.config();

// Initialize services from IoC container
Container.get<GoogleService>(GoogleService);

const client = new Client({
    partials: ["MESSAGE"],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

Container.get<TwentyFiveMan>(TwentyFiveMan).run(client);
Container.get<Kara>(Kara).run(client);

client.on("ready", () => {
    Logger.info("Logged in");
});

client.login(process.env.TH_BOT_TOKEN);
