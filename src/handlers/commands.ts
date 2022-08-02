import * as Discord from "discord.js";
import * as ms from "ms";
import * as fs from "fs";
import log4 from "../functions/log4";

const [pref, owner] = ["~", ["859853852441706567", "571151208299888640", "749096315027193909"]];

interface argumentParsed {
  id: string | void;
  time: number | void;
  total: number | void;
  onlyBot: boolean | void;
  url: string | void;
  text: string | void;
}

const commands = new Discord.Collection(),
  commandFiles: any = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
  const command: any = require(`../commands/${file}`);
  commands.set(command.default.initial.name, command.default);
}

export default async (client: Discord.Client, message: any) => {
  if (!message.content.toLowerCase().endsWith(pref) || message.author.bot) return;
  const args: string[] = message.content.slice(0, -pref.length).split(/ +/),
    getStrings: string = message.content.match(/`+(.*?)`+/g)?.[0];
  const commandName: string = args.shift().toLowerCase();
  let argsParsed: argumentParsed = {
    id: null,
    time: null,
    total: null,
    onlyBot: null,
    url: null,
    text: null
  };
  // Get the string :3
  if (getStrings) argsParsed.text = getStrings.replace(/`/g, "");
  // Get the url from attachment
  if (message.attachments?.first()) argsParsed.url = message.attachments.first().url;
  args.forEach((a) => {
    // argsParsed = {
    //   id: /^\d{10,}\b/.test(a)
    //     ? a
    //     : /^(fr|reply|fromreply)\b/i.test(a)
    //     ? message.mentions?.repliedUser?.id
    //     : null,
    //   time: /^(\d+(s|m|h|d))\b/i.test(a) ? ms(a) : null,
    //   total: /^\d{1,3}\b/.test(a) ? parseInt(a) : null,
    // };

    // Ignore if this in the Strings
    if (getStrings?.includes(a)) return;
    // Get the ID of anything
    if (/^\d{10,}\b/.test(a)) {
      return (argsParsed.id = a);
    }
    // Get the Time like 2d 50m 69s
    if (/^(\d+(s|m|h|d))\b/i.test(a)) return (argsParsed.time = ms(a));
    // Total? like the bulk message total (1 -999)
    if (/^\d{1,3}\b/.test(a)) return (argsParsed.total = parseInt(a));
    // If its a bot then its a bot (bot)
    if (/^!?(b|bot)\b/.test(a)) return (argsParsed.onlyBot = !a.startsWith("!"));
    // Get the url (might replace the url from attachment)
    if (/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/.test(a))
      argsParsed.url = a;
    // Mention the user (Might replace the ID from ID)
    if (message.mentions.users.size > 0) {
      return (argsParsed.id = message.mentions.users.first().id);
      // Get the user ID from reply instead xD
    } else if (/^(fr|reply|fromreply|guy|person|user)\b/i.test(a) && message.mentions.repliedUser?.id) {
      return (argsParsed.id = message.mentions.repliedUser.id);
    }
    // return "!";
  });
  // console.log(argsParsed, message.mentions.repliedUser.id);

  const command: any =
    commands.get(commandName) ||
    commands.find((cmd: any) => cmd.initial.alias && cmd.initial.alias.includes(commandName));
  if (!command) return;
  // if(true) return console.log("CMD runned but nothing is runned")

  //checking the commands is unusable
  if (command.initial.needPerms.bool && !message.member.permissions.has(command.initial.needPerms.permission)) {
    if (!owner.includes(message.author.id)) return;
    /*message.channel.send(
        lang["commands"].no_perms.replace(
          /%\$1/gi,
          command.initial.needPerms.permission.join(" ")
          )
          );*/
  }
  //checking the commands if its only for Owner of the Bot
  if (command.initial.ownerOnly && !owner.includes(message.author.id)) {
    return;
    /*message.channel
          .send(lang["commands"].owner_only)
          .then((d: Discord.Message) => setTimeout(() => d.delete(), 2500));*/
  }
  if (command.initial["unavailable"]) {
    return message.react("🔜");
    // message.channel.send(lang["commands"].unusable);
  }
  //checking the commands if they have arguments in it
  // if (command.initial.args && !args.length) {
  //   let reply: string = lang["commands"].need_arguments[0];
  //   if (command.initial.usage && lang["commands"].need_arguments[1]) {
  //     reply += lang["commands"].need_arguments[1];
  //   }
  //   return message.channel.send(reply);
  // }

  try {
    // msg.channel.startTyping();
    return await command.execute(client, message, {
      array: args,
      parsed: argsParsed
    });
    // msg.channel.stopTyping();
  } catch (err) {
    log4.error(`error! ${err}`);
    // msg.channel.stopTyping();
    message.react("940204886228881438");
    // message.reply(`${lang["commands"].error}\n\`\`\`xl\n${err}\`\`\``);
  }
};
