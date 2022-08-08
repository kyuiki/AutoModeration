import * as discord from "discord.js";
import events from "./src/events";
import log4 from "./src/functions/log4";

require("dotenv").config();

log4.info("Starting the bot...");

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.Guilds
  ],
  // intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildMessageReactions", "GuildMessageTyping"],
  ws: {
    properties: {
      browser: "Discord Android"
    }
  },
  presence: {
    status: "online",
    afk: true,
    activities: [
      {
        name: "with your mother",
        type: discord.ActivityType.Competing,
        url: "https://qky.life"
      }
    ]
  }
});
events(client);

process.on("uncaughtException", (e) => {
  log4.error("Main Proc --> ", e);
});
// log4.info(process.env.DISCORDTOKEN);
client.login(process.env.DISCORDTOKEN);
