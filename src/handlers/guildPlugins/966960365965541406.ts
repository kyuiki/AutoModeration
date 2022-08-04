// Kyuki Hangout
import * as Discord from "discord.js";
import log4 from "../../functions/log4";

export default {
  initial: {
    guildID: "966960365965541406"
  },
  async messageCreate(client: Discord.Client, message: Discord.Message) {
    // No Facebook
    {
      const fbAttachment = message.attachments?.some((x) => /(facebook|fb_reels)/gi.test(x.name));
      const fbRelated = /((?<!no\s))(facebo+k|fb\s)/gi.test(message.cleanContent);
      if (fbAttachment || fbRelated) message.react(message.guild.emojis.cache.get("1001544020050313427"));
    }
  },
  async messageUpdate(client: Discord.Client, messageOld: Discord.Message, messageNew: Discord.Message) {
    this.messageCreate(client, messageNew);
  },

  async guildMemberAdd(client, member) {}
};
