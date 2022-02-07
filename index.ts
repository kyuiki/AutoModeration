import * as discord from "discord.js";
import events from "./src/events";
import log4 from "./src/functions/log4";

log4.info("Starting the bot...");

const client = new discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
  ],
  ws: {
    properties: {
      $browser: "Discord Android",
    },
  },
  presence: {
    status: "online",
    afk: true,
    activities: [
      {
        name: "with your mother",
        type: "COMPETING",
        url: "https://qky.life",
      },
    ],
  },
});

events(client);

process.on("uncaughtException", (e) => {
  console.log(e);
});

// client.login("OTI5NzYxNzA1ODA0ODQ1MTA2.YdsCEA.gE4qMoSdSi21mXlXE-jm6HVb1-I");
client.login("ODgxNDc0OTQxNjE3MzI4MTM4.YStXgw.2BVuQPz0QVGlaF8_43rYf75-OgY");
