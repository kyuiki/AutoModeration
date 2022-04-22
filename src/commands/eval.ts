import * as ts from "typescript";
import * as Discord from "discord.js";
import * as path from "path";
import log4 from "../functions/log4";

const initial = {
  name: "eval",
  alias: ["ev"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: []
  }
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    if (message.author.id != "859853852441706567") return false;
    if (!args.parsed.text) return false;
    let result = ts.transpile(args.parsed.text);
    try {
      let res = eval(result);
      message.channel.send({
        embeds: [
          {
            title: "Executed! (0x1)",
            color: 0x11fc11,
            description: "**Code**```\n" + result + "```\n\n**Result**" + "```\n" + res + "```"
          }
        ]
      });
    } catch (e) {
      log4.error("Eval Command Error => ", e);
      message.channel.send({
        embeds: [
          {
            title: "Failed! (0x0)",
            color: 0xfc1111,
            description: "**Code**```\n" + result + "```\n\n**Result**" + "```\n" + e + "```"
          }
        ]
      });
    }
  }
};
