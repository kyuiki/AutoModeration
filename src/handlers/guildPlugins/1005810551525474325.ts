// Gey Phemus'es server
import * as Discord from "discord.js";

export default {
  initial: {
    guildID: "1005810551525474325"
  },
  async messageCreate(client: Discord.Client, message: Discord.Message) {
    //Limit Message to 8 Lines
    {
      const clean = message.cleanContent.split("\n");
      console.log(message.cleanContent);
      if (clean.length > 5) {
        if (
          message.member.roles.cache.has("1005815755847241728") ||
          message.member.roles.cache.has("1005815684737007696") ||
          message.author.bot
        ) {
          ("Bypassed");
        } else return message.delete();
      }
    }
  },
  async messageUpdate(client: Discord.Client, messageOld: Discord.Message, messageNew: Discord.Message) {
    this.messageCreate(client, messageNew);
  },

  async guildMemberAdd(client, member) {},
  async interactionCreate(client, interaction) {}
};
