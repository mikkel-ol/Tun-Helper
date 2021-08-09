import { Client } from "discord.js";

export interface SignupHandler {
    run(client: Client): void;
}
