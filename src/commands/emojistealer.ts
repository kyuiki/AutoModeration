import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "../functions/log4";

const initial = {
  name: "stealemojis",
  alias: ["se", "stealmojis"],
  ownerOnly: false,
  needPerms: {
    bool: true,
    permission: ["ADMINISTRATOR"]
  }
};

export default {
  initial,
  execute: async (client: Discord.Client, message: Discord.Message, args) => {
    if (!args.parsed.url) return message.react("❓");
    const fetchResult = await fetch(args.parsed.url)
      .then(async (r) => {
        if (!r.ok) return message.react("❌");
        return r.json();
      })
      .catch((e) => {
        return message.react("❌");
        log4.error(e);
      });
    if (!fetchResult) return;
    log4.info(fetchResult);
    const emojiList = fetchResult?.emojis;
    for (let emoji of emojiList) {
      if (args.parsed.text && !emoji.name.includes(args.parsed.text)) continue;
      message.guild.emojis
        .create({
          name: emoji.name,
          attachment: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "webp"}`
        })
        .then((x) => {
          log4.success(
            `Added ${emoji.name} (Animated:${emoji.animated}) (${emoji.id}) into this guild "${message.guild.id}"`
          );
        })
        .catch((e) => {
          log4.error(
            `Failed to Add ${emoji.name} (Animated:${emoji.animated}) (${emoji.id}) into this guild "${message.guild.id}"`,
            e
          );
          message.reply(
            `Failed to Add ${emoji.name} (Animated:${emoji.animated}) (${emoji.id}) into this guild "${message.guild.id}"!`
          );
        });
    }
    message.react("☑");
  }
};
