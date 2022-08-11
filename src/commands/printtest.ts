import * as Discord from "discord.js";

const initial = {
  name: "printtest",
  alias: ["prnttst", "test", "pt"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: []
  }
};
const ptbuttons = ["reportbadword,dummytest", "replyasdev"];
export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    const buttons: any = ptbuttons.map((x) =>
      new Discord.ButtonBuilder()
        .setCustomId(x)
        .setLabel(x)
        .setStyle(Discord.ButtonStyle.Primary)
        .setEmoji("🔌" as Discord.EmojiResolvable)
    );
    message.react("☑");
    message.channel.send({
      content: "this is a Dummy test",
      components: [new Discord.ActionRowBuilder().addComponents(buttons) as any]
    });
    message.reply(`Reply Test \nParsed Arguments : ${JSON.stringify(args.parsed)}`);
  }
};
