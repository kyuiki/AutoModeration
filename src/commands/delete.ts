import * as Discord from "discord.js";

const initial = {
  name: "delete",
  alias: ["d", "del"],
  needPerms: {
    bool: true,
    permission: ["MANAGE_MESSAGES"],
  },
};

export default {
  initial,
  execute: async (client: Discord.Client, message: Discord.Message, args) => {
    let messageList = await message.channel.messages.fetch({ limit: 100 });
    if (args.parsed.id)
      messageList = messageList.filter((d) => {
        return d.author.id == args.parsed.id;
      });
    else if (typeof args.parsed.onlyBot == "boolean")
      messageList = messageList.filter((d) => {
        return d.author.bot == args.parsed.onlyBot;
      });
    const messageArrays = messageList.first(args.parsed.total ?? 1);

    (message.channel as Discord.TextChannel | Discord.ThreadChannel)
      .bulkDelete(messageArrays)
      .then(() => {
        message.react("☑");
      })
      .catch(() => {
        message.react("❌");
      });
  },
};
