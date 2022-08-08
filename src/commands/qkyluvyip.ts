import * as Discord from "discord.js";
import log4 from "../functions/log4";

const initial = {
  name: "qkyluvyip",
  alias: ["qly", "qkyloveyou"],
  needPerms: {
    bool: false,
    permission: ["CHANGE_NICKNAME"]
  }
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message) => {
    if (message.guild.id != "966960365965541406") return;
    message.react("☑");
    fetch("http://localhost:3031/api/yiff/database").then(async (r) => {
      if (!r.ok) return message.reply("Qky website down! cant get the thing!");
      const result = await r.json();
      message.channel.send({
        content: `Total (showed/filtered): \`${result.total}\`, Total: \`${result.trueTotal}\`, NoDup Total: \`${
          result.trueNoDupTotal
        }\`\nHash : \`${result.hash}\`${"||​||".repeat(200)}${result.url}`,
        components: [
          {
            type: Discord.ComponentType.ActionRow,
            components: [
              {
                type: Discord.ComponentType.Button,
                label: "Download2Local",
                style: Discord.ButtonStyle.Secondary,
                customId: result.hash
              },
              {
                type: Discord.ComponentType.Button,
                label: "Web-Preview",
                style: Discord.ButtonStyle.Link,
                url: `https://yiff.qky.life/${result.hash}`
              }
            ]
          }
        ]
      });
    });
  }
};
