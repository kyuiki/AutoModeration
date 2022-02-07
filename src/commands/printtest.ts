import * as Discord from "discord.js";

const initial = {
  name: "printtest",
  alias: ["prnttst", "test", "pt"],
  needPerms: {
    bool: false,
    permission: [],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    message.react("☑");
    message.channel.send("this is a Dummy test");
    message.reply(
      `Reply Test \nParsed Arguments : ${JSON.stringify(args.parsed)}`
    );
  },
};
