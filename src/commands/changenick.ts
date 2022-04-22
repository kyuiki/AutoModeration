import * as Discord from "discord.js";

const initial = {
  name: "changenick",
  alias: ["cn"],
  needPerms: {
    bool: true,
    permission: ["MANAGE_NICKNAMES"],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    const member = message.guild.members.cache.get(args.parsed.id);
    if (!member) return message.react("❓");
    member
      .setNickname(
        args.parsed.text ?? "",
        `Nickname changed by ${message.author.tag}`
      )
      .then(() => {
        message.react("☑");
      })
      .catch(() => {
        message.react("❌");
      });
  },
};
