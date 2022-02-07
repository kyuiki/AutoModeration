import * as Discord from "discord.js";

const initial = {
  name: "softban",
  alias: ["sb"],
  unavailable: true,
  needPerms: {
    bool: true,
    permission: ["BAN_MEMBERS"],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    // throw Error("test");
    message.react("☑");
  },
};
