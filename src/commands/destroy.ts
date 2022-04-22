import * as Discord from "discord.js";
import log4 from "../functions/log4";
import tracker from "../functions/tracker";

const initial = {
  name: "destroy",
  alias: ["kys", "kms"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: [],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    message.channel.send("I should kill myself, NOW!");
    log4.warn("I Should Kill Myself. Now! Killing the process...");

    setTimeout(process.exit, 5000);
  },
};
