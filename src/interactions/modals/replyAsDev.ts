import * as Discord from "discord.js";
import log4 from "../../functions/log4";

const initial = {
  name: "modalimportantmessage",
  unavailable: false,
  ownerOnly: true
};

export default {
  initial,
  execute: (client: Discord.Client, interaction: Discord.ModalSubmitInteraction, args) => {
    const fields = interaction.fields;
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

    client.users
      .fetch(fields.getTextInputValue("UserID"))
      .then((user) => {
        user.send({
          content: `
<:bot:1007171743632334882> **Message From Developer :**
> ${fields.getTextInputValue("DevMessage")?.split("\n").join("\n> ")};

<:best:1007171754441068666> **What's Patched?**
${fields.getTextInputValue("Patches")}

*Thank you for using feature seriously. Have a nice day*
`,
          components
        });
        interaction.reply({ ephemeral: true, content: "[SUCCESS]!" });
      })
      .catch((e) => {
        interaction.reply({ ephemeral: true, content: "[FAILED]!" });
      });
  }
};
