import * as Discord from "discord.js";
import log4 from "../functions/log4";

const initial = {
  name: "sendlonger",
  alias: ["sl", "sendlong"],
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
    const member: Discord.User | Discord.TextBasedChannel = args.parsed.id
      ? await client.users.fetch(args.parsed.id)
      : (message.channel as Discord.TextBasedChannel);
    const fetchResult = await fetch(args.parsed.url)
      .then(async (r) => {
        if (!r.ok) return message.react("❌");
        return r.text();
      })
      .catch((e) => {
        return message.react("❌");
        log4.error(e);
      });
    if (!fetchResult) return;
    log4.info(fetchResult);
    (fetchResult as string).match(/[\s\S]{1,2000}/gi).forEach((x) => member.send(x));
    message.react("☑");
  }
};
