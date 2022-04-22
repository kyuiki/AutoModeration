import * as Discord from "discord.js";
import tracker from "../functions/tracker";

const initial = {
  name: "track",
  alias: ["trc"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: [],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    if (!args.parsed.id) return message.react("❓");
    message.react("📃");
    return new tracker(args.parsed.id);
  },
};
