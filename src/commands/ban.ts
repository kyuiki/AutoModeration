import * as Discord from "discord.js";

const initial = {
  name: "ban",
  alias: ["b"],
  details: {
    description: "Ban user (You can ban user without user being in the server)",
    supported: [""]
  },
  needPerms: {
    bool: true,
    permission: ["BAN_MEMBERS"]
  }
};

export default {
  initial,
  execute: async (client: Discord.Client, message: Discord.Message, args) => {
    if (!args.parsed.id) return message.react("❓");
    const member = await client.users.fetch(args.parsed.id);
    if (
      !(
        await message.guild.members
          .fetch(member)
          .then()
          .catch(() => {
            return { bannable: true };
          })
      )?.bannable ||
      args.parsed.id == message.author.id
    )
      return message.react("❌");
    message.guild.bans
      .create(member, {
        deleteMessageDays: 7,
        reason: args.parsed.text ?? `Banned by Moderator ${message.author.tag}`
      })
      .then(() => {
        message.react("☑");
      });
    // .kick(`Kicked by Moderator ${message.author.tag}`)
  }
};

//!(await message.guild.members.fetch(member)).bannable
