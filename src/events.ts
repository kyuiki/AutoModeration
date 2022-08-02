import * as Discord from "discord.js";
import * as fs from "fs";

import commands from "./handlers/commands";
import antiphising from "./workers/antiphishing";
import antibadword from "./workers/antibadword";
import log4 from "./functions/log4";

const config = require("./json/config.json");

let trackedUsers = new Map();

const plugins = new Discord.Collection(),
  pluginFiles: any = fs.readdirSync("./src/handlers/guildPlugins").filter((file) => file.endsWith(".ts"));
for (const file of pluginFiles) {
  const plugin: any = require(`./handlers/guildPlugins/${file}`);
  plugins.set(plugin.default.initial.guildID, plugin.default);
}

export default (client: Discord.Client) => {
  client.on("ready", () => {
    log4.success(`Ready! logged in as ${client.user.tag} (${client.guilds.cache.size} Guilds)`);
  });

  client.on("messageCreate", async (message: Discord.Message) => {
    // Start the Plugin
    plugins.get(message.guild.id)?.["messageCreate"]?.(client, message);

    antiphising(client, message);

    //Find in Config
    const conf = config.find((a) => a.id == message.guild.id);
    if (conf) {
      if (conf.config.antiBadword.isActive) antibadword(client, conf.config.antiBadword, message);
    }
    //Run command
    const waiting = await commands(client, message);
    //Tracker uwu
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
    // Start the Plugin
    plugins.get(message.guild.id)?.["messageUpdate"]?.(client, oldMessage, message);

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
    // Start the Plugin
    plugins.get(member.guild.id)?.["guildMemberAdd"]?.(client, member);
  });
  client.on("typingStart", (t: Discord.Typing): void => {
    // log4.log("everything good!");
    // let channel = t.channel as Discord.TextChannel | Discord.ThreadChannel;
    // log4.log(`*${t.guild.name} | #${channel.name} | @${t.member.displayName}`);
  });
};
