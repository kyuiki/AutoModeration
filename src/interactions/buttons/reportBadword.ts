import * as Discord from "discord.js";

const initial = {
  name: "reportbadword",
  unavailable: false
};

export default {
  initial,
  execute: (client: Discord.Client, interaction: Discord.ButtonInteraction, args) => {
    const reportModal = new Discord.ModalBuilder()
      .setTitle("Complain about Badword Detection.")
      .setCustomId("ModalComplainBadword");
    const BW = args[0].split("|").join(",");

    const detectedAs = new Discord.TextInputBuilder()
      .setLabel("Alleged Words (Don't Edit!)")
      .setCustomId("AllegedWording")
      .setMinLength(BW.length)
      .setMaxLength(BW.length)
      .setPlaceholder("Now you are fucked up! I told you to not to delete!")
      .setValue(BW)
      .setRequired(true)
      .setStyle(Discord.TextInputStyle.Short);
    const listWords = new Discord.TextInputBuilder()
      .setPlaceholder("List of words (Separated with comma). eg crap,bad,...")
      .setCustomId("AllegedlyAsBadword")
      .setMaxLength(1000)
      .setLabel("Words that detected as badword.")
      .setRequired(true)
      .setStyle(Discord.TextInputStyle.Paragraph);
    const Contexts = new Discord.TextInputBuilder()
      .setPlaceholder('I was saying "Good Night" But the bot detect it as Badword.')
      .setCustomId("Context")
      .setMinLength(25)
      .setMaxLength(1500)
      .setLabel("Context. (Retype your message)")
      .setRequired(true)
      .setStyle(Discord.TextInputStyle.Paragraph);
    const OptionalFeedbacks = new Discord.TextInputBuilder()
      .setPlaceholder("Cool bot!")
      .setCustomId("NoteForDev")
      .setMaxLength(500)
      .setRequired(false)
      .setLabel("Note for Developer (Optional)")
      .setStyle(Discord.TextInputStyle.Short);

    const actionRows = [
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(detectedAs),
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(listWords),
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(Contexts),
      new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(OptionalFeedbacks)
    ];
    reportModal.addComponents(...actionRows);

    interaction.showModal(reportModal);
  }
};
