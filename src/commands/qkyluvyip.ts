import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "../functions/log4";

const initial = {
  name: "qkyluvyip",
  alias: ["qly"],
  needPerms: {
    bool: false,
    permission: ["CHANGE_NICKNAME"]
  }
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message) => {
    if (message.guild.id != "956877285754015804") return;
    message.react("☑");
    fetch("https://yiff.qky.life/api/getyiff/database").then(async (r) => {
      if (!r.ok) return message.reply("Qky website down! cant get the thing!");
      const result = await r.json();
      message.channel.send({
        content: `Total (showed/filtered): \`${result.total}\`, Total: \`${result.trueTotal}\`, NoDup Total: \`${
          result.trueNoDupTotal
        }\`\nHash : \`${result.hash}\`${"||​||".repeat(200)}${result.url}`,
        components: [
          {
            type: "ACTION_ROW",
            components: [
              {
                type: "BUTTON",
                label: "Download2Local",
                style: "PRIMARY",
                customId: result.hash
              },
              {
                type: "BUTTON",
                label: "Web-Preview",
                style: "LINK",
                url: `https://yiff.qky.life/${result.hash}`
              }
            ]
          }
        ]
      });
    });
  }
};
