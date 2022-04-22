import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "../functions/log4";
import stringifyObj from "../functions/stringifyObj";

const initial = {
  name: "minecraft",
  alias: ["mc"],
  ownerOnly: false,
  needPerms: {
    bool: false,
    permission: []
  }
};
const timetime = {};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    const hasThisRole = message.member.roles.cache.has("956949376977231972"),
      thisTime = new Date().valueOf();
    // if (hasThisRole) message.reply("yes haha funny monke");
    if (thisTime < timetime[message.author.id])
      return message.reply(`no haha :( wait ${timetime[message.author.id] - thisTime} milisecumds`);
    timetime[message.author.id] = thisTime + 5000;
    fetch(
      "http://194.233.88.189:3030/v1/server",
      // "https://api.qky.life/api/gallery",
      { headers: { key: process.env.MINECRAFTNAKKI } }
    )
      .then(async (x) => {
        if (!x.ok) {
          message.reply("utterly unexcuseable!");
          return log4.error("No!");
        }
        const xj = await x.json();
        log4.success(stringifyObj(xj).match(/.{1,4000}/gi));
        message.reply({
          content: "Great Response!",
          embeds: [
            {
              title: `${xj.name} (${xj.version})`,
              description: stringifyObj(xj).match(/(.|\s){1,4000}/gi)[0]
            }
          ]
        });
      })
      .catch((e) => {
        log4.error("ErrorNo!");
        message.reply("utterly unexcuseable!");
      });
  }
};
