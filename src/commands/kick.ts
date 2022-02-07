import * as Discord from "discord.js";

const initial = {
  name: "kick",
  alias: ["k"],
  needPerms: {
    bool: true,
    permission: ["BAN_MEMBERS"],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    if (!args.parsed.id) return message.react("❓");
    const member = message.guild.members.cache.get(args.parsed.id);
    if (!member.kickable || args.parsed.id == message.author.id)
      return message.react("❌");
    member
      .kick(args.parsed.text ?? `Kicked by Moderator ${message.author.tag}`)
      .then(() => {
        message.react("☑");
      });
  },
};
