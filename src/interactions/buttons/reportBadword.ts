import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "../../functions/log4";

let blacklistedUsers: string[] = [];
const initial = {
  name: "reportbadword",
  unavailable: false
};
const getBlacklist = () =>
  fetch("https://discord.com/api/v10/channels/1006550969011687555/messages", {
    headers: {
      Authorization: "Bot " + process.env.DISCORDTOKEN
    }
  }).then(async (r) => {
    if (!r.ok) return log4.error(await r.text());
    const output = (await r.json())
      .filter((x) => x.type === 0)
      .map((x) => x.content)
      .join(" ")
      .split(" ");
    blacklistedUsers = output;
    log4.success(`The blacklisted user from report is ready!`);
  });
getBlacklist();
setTimeout(getBlacklist, 5 * (60 * 1000));

export default {
  initial,
  execute: (client: Discord.Client, interaction: Discord.ButtonInteraction, args) => {
    log4.log(blacklistedUsers.includes(interaction.user.id), interaction.user.id);
    if (blacklistedUsers.includes(interaction.user.id))
      return interaction.reply({
        content: "[BLACKLISTED_FROM_REPORT]!",
        ephemeral: true,
        components: [
          {
            type: Discord.ComponentType.ActionRow,
            components: [
              {
                type: Discord.ComponentType.Button,
                label: "Support Server",
                style: Discord.ButtonStyle.Link,
                url: "https://discord.gg/dVqm9rrgdr"
              }
            ]
          }
        ]
      });

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
