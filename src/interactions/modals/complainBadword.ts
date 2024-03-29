import * as Discord from "discord.js";
import log4 from "../../functions/log4";
import { sendWebhookByChannel } from "../../functions/webhookViaChannel";

const initial = {
  name: "modalcomplainbadword",
  unavailable: false
};

export default {
  initial,
  execute: (client: Discord.Client, interaction: Discord.ModalSubmitInteraction, args) => {
    const fields: any = interaction.fields,
      embedding = {
        title: "Complain Submitted!",
        description: `About **Complain about Badword**\n**User ID** : ${interaction.user.id}`,
        author: {
          name: "Issued by " + interaction.user.tag
        },
        fields: [
          {
            name: "Alleged Wording",
            value: fields.getField("AllegedWording").value
          },
          {
            name: "Allegedly As Badword",
            value: fields.getField("AllegedlyAsBadword").value
          },
          {
            name: "Message Context",
            value: fields.getField("Context").value
          },
          {
            name: "Feedback",
            value: `We got => ${fields.getField("NoteForDev")?.value}`
          }
        ],
        footer: {
          text: "Issued by " + interaction.user.tag,
          icon_url: interaction.user.avatarURL()
        },
        url: "",
        color: 0x7030af
      };
    log4.info(embedding);
    sendWebhookByChannel(client, "1006107324785643621", {
      username: "Another days with Complains...",
      avatar_url: interaction.user.avatarURL(),
      embeds: [embedding]
    });
    interaction.reply({
      ephemeral: true,
      content: "Congrats! its being processed! (Lying / Spamming might resulted in blacklist!)"
    });
  }
};
