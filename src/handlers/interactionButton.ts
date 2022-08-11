import * as Discord from "discord.js";
import * as fs from "fs";
import log4 from "../functions/log4";

const owner = process.env.BOTOWNER?.split(",");

const interactProcs = new Discord.Collection(),
  interactFiles: any = fs.readdirSync("./src/interactions/buttons").filter((file) => file.endsWith(".ts"));
for (const file of interactFiles) {
  const interact: any = require(`../interactions/buttons/${file}`);
  interactProcs.set(interact.default.initial.name, interact.default);
}

export default async (client: Discord.Client, interaction: Discord.Interaction) => {
  const components = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        {
          type: Discord.ComponentType.Button,
          label: "Support Server",
          style: Discord.ButtonStyle.Link,
          url: "https://discord.gg/dVqm9rrgdr",
          customId: ""
        }
      ]
    }
  ];
  if (!interaction.isButton()) return;
  const args: string[] = interaction.customId.split(/,+/);
  const interactName: string = args.shift().toLowerCase();

  const button: any = interactProcs.get(interactName);
  if (!button) return;

  if (button.initial["unavailable"]) {
    return interaction.reply({
      ephemeral: true,
      content: "[UNAVAILABLE_INTERACTION]!",
      components
    });
  }

  if (button.initial.ownerOnly && !owner.includes(interaction.user.id)) {
    return interaction.reply({
      ephemeral: true,
      content: "[DEV_ONLY_INTERACTION]!",
      components
    });
  }

  try {
    return await button.execute(client, interaction, args);
  } catch (err) {
    log4.error(`error! ${err}`);
    log4.error(err);
    return interaction.reply({
      ephemeral: true,
      content: "[ERROR_INTERACTION_FAILED]!",
      components
    });
  }
};
