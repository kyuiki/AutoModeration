import * as ts from "typescript";
import * as Discord from "discord.js";
// import * as path from "path";
// import * as vm from "vm";
import log4 from "../functions/log4";

const initial = {
  name: "eval",
  alias: ["ev","evaluate"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: []
  }
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    if (!["749096315027193909","859853852441706567"].includes(message.author.id)) return false;
    if (!args.parsed.text) return false;
    let result = ts.transpile(`import log4 from "../functions/log4"; ${args.parsed.text}`);
    try {
      let res = eval(result);
      log4.info(res);
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
