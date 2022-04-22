// import * as natural from "natural";
import * as Discord from "discord.js";
import log4 from "../functions/log4";

const initial = {
  name: "sentiment",
  alias: ["sa", "sential"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: []
  }
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    (message.guild.channels.cache.get("959121207196811365") as Discord.VoiceBasedChannel).createInvite({
      targetType: 2,
      targetApplication: "755600276941176913"
    });
    if (!args.parsed.text) return message.react("❓");
    // const tokenizer = new natural.WordTokenizer();
    // const reviews = tokenizer.tokenize(args.parsed.text.toLowerCase().replace(/[^a-zA-Z\s]+/g, ""));
    // log4.log(reviews);
  }
};
