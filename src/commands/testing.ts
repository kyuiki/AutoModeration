// import * as natural from "natural";
import * as Discord from "discord.js";
import log4 from "../functions/log4";

const initial = {
  name: "x--",
  alias: ["t-", "i think this is for test", "experimental"],
  ownerOnly: true,
  needPerms: {
    bool: false,
    permission: []
  }
};

export default {
  initial,
  execute: (client: Discord.Client, message: Discord.Message, args) => {
    message.channel.send({
      content: "Please click button below to scan QR Co- i mean to verify!",
      components: [
        {
          type: Discord.ComponentType.ActionRow,
          components: [
            {
              type: Discord.ComponentType.Button,
              label: "Verify UwU!",
              style: Discord.ButtonStyle.Primary,
              customId: "Sex My Guy!"
            }
          ]
        }
      ]
    });
  }
};
