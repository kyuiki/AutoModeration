import * as Discord from "discord.js";
import commands from "./handlers/commands";
import memberAuto from "./handlers/memberAutorole";
import antiphising from "./workers/antiphishing";
import log4 from "./functions/log4";

let trackedUsers = new Map();

export default (client: Discord.Client) => {
  client.on("ready", () => {
    log4.success(`Ready! logged in as ${client.user.tag} (${client.guilds.cache.size} Guilds)`);
  });

  client.on("messageCreate", async (message: Discord.Message) => {
    // console.log(message.content);
    message.attachments[0];
    antiphising(client, message);
    const waiting = await commands(client, message);
    if (trackedUsers.has(message.author.id)) trackedUsers.get(message.author.id).chat(message);

    if (waiting?.imLogging) {
      if (trackedUsers.has(waiting.userID)) {
        trackedUsers.delete(waiting.userID);
        waiting.delete();
      } else {
        waiting.start();
        trackedUsers.set(waiting.userID, waiting);
      }
    }
    // if (message.author.username == "Qky") return log4.error(message);
  });
  client.on("messageUpdate", async (oldMessage: Discord.Message, message: Discord.Message) => {
    // console.log(message.content);
    const waiting = await commands(client, message);
    if (trackedUsers.has(message.author.id)) trackedUsers.get(message.author.id).chat(message);

    if (waiting?.imLogging) {
      if (trackedUsers.has(waiting.userID)) {
        trackedUsers.delete(waiting.userID);
        waiting.delete();
      } else {
        waiting.start();
        trackedUsers.set(waiting.userID, waiting);
      }
    }
    // if (message.author.username == "Qky") return log4.error(message);
  });
  client.on("guildMemberAdd", async (member: Discord.GuildMember) => {
    memberAuto(client, await member);
  });
  client.on("typingStart", (t: Discord.Typing): void => {
    // log4.log("everything good!");
    // let channel = t.channel as Discord.TextChannel | Discord.ThreadChannel;
    // log4.log(`*${t.guild.name} | #${channel.name} | @${t.member.displayName}`);
  });
};
