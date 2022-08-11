import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "../../functions/log4";

let blacklistedUsers: string[] = [];
const initial = {
  name: "replyasdev",
  unavailable: false,
  ownerOnly: true
};

export default {
  initial,
  execute: (client: Discord.Client, interaction: Discord.ButtonInteraction, args) => {
    const reportModal = new Discord.ModalBuilder()
      .setTitle("Send Important Messages")
      .setCustomId("ModalImportantMessage");

    const UserID = new Discord.TextInputBuilder()
      .setLabel("User ID")
      .setCustomId("UserID")
      .setMinLength(18)
      .setPlaceholder("Put User ID Here")
      .setRequired(true)
      .setStyle(Discord.TextInputStyle.Short);
    const DevMessage = new Discord.TextInputBuilder()
      .setPlaceholder("Your Message")
      .setCustomId("DevMessage")
      .setMaxLength(1000)
      .setLabel("Your Message")
      .setRequired(true)
      .setStyle(Discord.TextInputStyle.Paragraph);
    const Patches = new Discord.TextInputBuilder()
      .setPlaceholder("Removed Sex.")
      .setCustomId("Patches")
      .setMaxLength(1500)
      .setLabel("Describe Patches")
      .setRequired(true)
      .setStyle(Discord.TextInputStyle.Paragraph);

    const actionRows = [
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(UserID),
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(DevMessage),
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(Patches)
    ];
    reportModal.addComponents(...actionRows);

    interaction.showModal(reportModal);
  }
};
