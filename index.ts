import * as discord from "discord.js";
// import statusChanger from "./private/alwaysOnline";
import statusChanger from "./private/statusChanger";
import events from "./src/events";
import log4 from "./src/functions/log4";

require("dotenv").config();

log4.info("Starting the bot...");

const client = new discord.Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING"],
  ws: {
    properties: {
      $browser: "Discord Android"
    }
  },
  presence: {
    status: "online",
    afk: true,
    activities: [
      {
        name: "with your mother",
        type: "COMPETING",
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

// statusChanger(process.env.DISCORDTOKEN);
statusChanger();
