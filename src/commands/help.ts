import * as Discord from "discord.js";

const initial = {
  name: "help",
  alias: ["?"],
  nsfw: true,
  needPerms: {
    bool: false,
    permission: []
  }
};

export default {
  initial,
  execute: async (client: Discord.Client, message: Discord.Message, args, command) => {
    const commands = command
      .filter((x) => !x.ownerOnly)
      .filter((x) => !x.nsfw)
      .map((x) => `${x.name}`);
    const H2U = `
**A. How to use this bot?**
To use this bot, It's quite simple! and doesn't need to be in order to use this bot.

 **1. Usage**
 Unlike other bot, We use reverse prefix! usually other bot do \`!help\` but this one we use suffix instead of prefix.\`\`\`
<command_name> [Any Arguments (Check 1a)] <prefix>\`\`\`
  **a. Arguments**
  For argument we use algorithm that pick each argument perfectly well. You can write any nonsense and the bot will still pick it up.
  The list of valid argument :\`\`\`
Number            : 1-999
UserID            : @Mention, 123456789069420
UserID from Reply : fr, fromreply, reply, guy, person, user
Time              : 1s, 1m, 1h, 1d
only Bots / Users : bot / !bot
Text              : \`Type Any Text Here\`, \\\`\\\`\\\`Type any text here\\\`\\\`\\\`
URL / Attachment  : https://example.com, <or just send the file normally>\`\`\`

  **b. Usage Example**
  Each commands have varies arguments, for example \`timeout\` command.\`\`\`
(Reply the user you want to punish)
timeout reply 59m~\`\`\`
  What that does is get the user ID from reply with \`reply\` argument and timeout them for 59 minutes with \`Time\` argument (see 1a).

  You can even type it drunkly and it will be recognized by this bot. For example we gonna use \`delete\` command.\`\`\`
delete the bot messages for... idk maybe 20 messages!! Pleaseee~\`\`\`
  What the bot see is valid command (You can try that command if you curious). What the bot see i\`\`\`
delete bot 20~\`\`\`
  Any nonsense stuff will be ignored and only argument that recognized by bot can be processed

 **2. List of commands**
 List of commands that available in this bot are.
 \`\`\`
${commands.join(", ")}\`\`\`
`;

    message.channel.send(H2U);
  }
};
