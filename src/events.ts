import * as Discord from "discord.js";
import commands from "./handlers/commands";
import antiphising from "./workers/antiphishing";
import log4 from "./functions/log4";

export default (client: Discord.Client) => {
  client.on("ready", () => {
    log4.success(`Ready! logged in as ${client.user.tag}`);
  });

  client.on("messageCreate", (message: Discord.Message) => {
    commands(client, message);
    antiphising(client, message);
    // if (message.author.username == "Qky") return log4.error(message);
  });
  client.on("typingStart", (t) => {
    // let channel = t.channel as Discord.TextChannel | Discord.ThreadChannel;
    // log4.log(`*${t.guild.name} | #${channel.name} | @${t.member.displayName}`);
  });
};
