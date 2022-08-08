import * as Discord from "discord.js";
import * as fs from "fs";
import log4 from "../functions/log4";

const interactProcs = new Discord.Collection(),
  interactFiles: any = fs.readdirSync("./src/interactions/modals").filter((file) => file.endsWith(".ts"));
for (const file of interactFiles) {
  const interact: any = require(`../interactions/modals/${file}`);
  console.log(interact.default.initial.name);
  interactProcs.set(interact.default.initial.name, interact.default);
}

export default async (client: Discord.Client, interaction: Discord.Interaction) => {
  log4.info("Modal Isnt Passed");
  if (!interaction.isModalSubmit()) return;
  log4.info("Modal Is Passed");
  const args: string[] = interaction.customId.split(/,+/);
  const interactName: string = args.shift().toLowerCase();
  const modal: any = interactProcs.get(interactName);
  if (!modal) return log4.error("No Modal?");
  // if(true) return console.log("CMD runned but nothing is runned")

  //checking the commands is unusable
  if (modal.initial["unavailable"]) {
    log4.error("unavailable modal");
    return interaction.reply({ ephemeral: true, content: "[UNAVAILABLE]!" });

    // message.channel.send(lang["commands"].unusable);
  }
  //checking the commands if they have arguments in it
  // if (command.initial.args && !args.length) {
  //   let reply: string = lang["commands"].need_arguments[0];
  //   if (command.initial.usage && lang["commands"].need_arguments[1]) {
  //     reply += lang["commands"].need_arguments[1];
  //   }
  //   return message.channel.send(reply);
  // }

  try {
    // msg.channel.startTyping();
    log4.success("Lets a go!");
    return await modal.execute(client, interaction, args);
    // msg.channel.stopTyping();
  } catch (err) {
    log4.error(`error! ${err}`);
    log4.error(err);
    // msg.channel.stopTyping();
    return interaction.reply({ ephemeral: true, content: "[ERROR_COMMAND_FAILED]!" });
    // message.reply(`${lang["commands"].error}\n\`\`\`xl\n${err}\`\`\``);
  }
};
