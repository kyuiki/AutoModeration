import * as Discord from "discord.js";
import * as fs from "fs";
import log4 from "../functions/log4";

const plugins = new Discord.Collection(),
  pluginFiles: any = fs.readdirSync("./src/handlers/guildPlugins").filter((file) => file.endsWith(".ts"));
for (const file of pluginFiles) {
  const plugin: any = require(`../handlers/guildPlugins/${file}`);
  plugins.set(plugin.default.initial.guildID, plugin.default);
}

export default async function (client: Discord.Client, member: Discord.GuildMember) {
  if (!member) log4.error(member);
  const pluguild: any = plugins.get(member.guild.id);
  if (!pluguild) return false;
  pluguild.exec(client, member);
}
