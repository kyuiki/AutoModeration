import * as Discord from "discord.js";
import process = require("process");
import log4 from "../functions/log4";
import * as ts from "typescript";

const initial = {
  name: "info",
  alias: ["inf"],
  needPerms: {
    bool: false,
    permission: [],
  },
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    message.channel.send({
      embeds: [
        {
          description: `
**Versions**
Node \`v${process.versions.node}\`
TypeScript \`v${ts.version}\`
Discord.JS \`v${Discord.version}\`
    `,
        },
      ],
    });
  },
};
