import * as Discord from "discord.js";
import log4 from "../../functions/log4";

const initial = {
  name: "Fuck",
  unavailable: true
};

export default {
  initial,
  execute: (client: Discord.Client, interaction: Discord.ButtonInteraction, args) => {
    log4.log(interaction);
    interaction.reply({ ephemeral: true, content: "Congrats its being processed hopefully!" });
  }
};
