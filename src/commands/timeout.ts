import * as Discord from "discord.js";

const initial = {
  name: "timeout",
  alias: ["to"],
  needPerms: {
    bool: true,
    permission: ["MODERATE_MEMBERS"],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    if (!args.parsed.id) return message.react("❓");
    const member = message.guild.members.cache.get(args.parsed.id);
    if (args.parsed.id == message.author.id) return message.react("❌");
    member
      .timeout(
        args.parsed.time ?? 60000,
        args.parsed.text ?? `Timeout-ed by Moderator ${message.author.tag}`
      )
      .then(() => {
        message.react("☑");
      })
      .catch(() => {
        message.react("❌");
      });
  },
};
