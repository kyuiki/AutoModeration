import * as Discord from "discord.js";
import log4 from "../functions/log4";
import random from "../functions/random";
import { specialReplacer } from "../functions/specialReplacer";
import { sendWebhookByChannel } from "../functions/webhookViaChannel";

const words = require("../json/badwords.json").words;

log4.log(
  "List of words => ",
  Object.values(words).map((x: any) => x.short)
);

interface BadWordsInterface {
  word: string[];
  pattern: string[];
  swearBool: boolean;
  animalBool: boolean;
}

/**
 * Anti-Badword Module
 * @param client Discord Client
 * @param message Message
 * @param old Message but Old
 * @returns
 */
export default async function (client: Discord.Client, config: any, message: Discord.Message, old?: Discord.Message) {
  if (((message.channel as Discord.TextChannel).nsfw && config["isNSFWChannelAllowed"]) || message.author.bot) return;
  if (
    config.filterChannels?.list?.length &&
    config.filterChannels?.list?.includes(message.channel.id) !== config.filterChannels?.invert
  )
    return log4.warn("This Channel is allowed");

  var str = replaceCommon(message.content);
  // log4.log(`Quick Comparison : \n Filtered Text : ${str} \n Unfiltered Text : ${message.content}`);
  let before = "";
  if (old) {
    before = `**Before** :\n> ${old.content}\n**After** :\n`;
  }

  //The Array Randomizer
  const rndmizer = (a) => {
    return a[Math.floor(Math.random() * a.length)];
  };
  //The Replacer
  const replacer = (match, p1) => {
    switch (p1) {
      case "word":
        return swearBadword.word.join(", ");
      case "user":
        return `<@${message.author.id}>`;
      default:
        console.log("Not found ", match, p1);
        break;
    }
  };

  // Joining every Arrays in the Config

  let badwords: string[] = [],
    animal = words.animal.list,
    swearBadword: BadWordsInterface = {
      word: [],
      pattern: [],
      swearBool: false,
      animalBool: false
    };
  if (config.config["evil"]) badwords.push(...words.evil.list);
  if (config.config["sexual"]) badwords.push(...words.sexual.list);
  if (config.config["horny"]) badwords.push(...words.horny.list);
  if (config.config["japanese_sex"]) badwords.push(...words.japanese_sex.list);
  if (config.config["lgbtq"]) badwords.push(...words.lgbtq.list);
  if (config.config["sex_action"]) badwords.push(...words.sex_action.list);
  if (config.config["swears"]) badwords.push(...words.swears.list);
  // if(config.config["animal"]) badwords.push(...words.animal.list)
  if (config.config["racism"]) badwords.push(...words.racism.list);
  if (config.config["other"]) badwords.push(...words.other.list);
  if (config.config["custom"].length > 0) badwords.push(...config.config["custom"]);
  if (config.config["emoji"]) {
    str = str
      .replace(new RegExp(words.emoji.config, "giu"), `banned_emoji${random(4, "0")}`)
      .replace(/[^a-z0-9\s_]/gi, "");
    badwords.push(...words.emoji.list);
  } else {
    str = str.replace(/[^a-z0-9\s_]/gi, "");
  }

  for (var i in badwords) {
    if (str.match(new RegExp(badwords[i], "gi"))) {
      swearBadword.swearBool = true;
      swearBadword.pattern.push(badwords[i]);
      swearBadword.word.push(...str.match(new RegExp(badwords[i], "gi")));
      // log4.log(`swearBadword.word`);
    }
  }

  if (config.config["animal"])
    for (var i in animal) {
      if (str.match(new RegExp(animal[i], "gi"))) {
        swearBadword.animalBool = true;
        swearBadword.pattern.push(animal[i]);
        swearBadword.word.push(...str.match(new RegExp(animal[i], "gi")));
      }
    }
  // console.log(config.config["custom"].length > 0, config.config["custom"], badwords)
  //Filter
  // The Response
  if (swearBadword?.swearBool || (swearBadword?.animalBool && !str.includes("hewan"))) badwordResponse();

  // The Functions
  function badwordResponse() {
    if (config.isAdminAllowed && message.member?.permissions?.has(Discord.PermissionsBitField.Flags.Administrator))
      return console.log("Admin is allowed");
    if (!message.member?.permissions?.has(Discord.PermissionsBitField.Flags.Administrator)) {
      // if (client.qky["badword"][message.author.id])
      //   client.qky["badword"][message.author.id] += swearBadword.word.length;
      // else client.qky["badword"][message.author.id] = swearBadword.word.length;
    }

    // DON'T LOG THE WORD! OR IT WILL CRASH THE WHOLE SYSTEM!

    log4.warn(
      "Swear word used, next action will be considered! Words : (" + swearBadword.word.join(", ") + ")"
      // `Unclean String => ${str}`
    );
    sendWebhookByChannel(client, config.channel, {
      name: "Badword detection",
      embeds: [
        {
          title: "Badword Detected!",
          description:
            before +
            "> " +
            str +
            "\nDetected As : `" +
            `${swearBadword.word.join(", ")}` +
            "`\nBadWord? : `" +
            swearBadword.swearBool +
            "`\nAnimalWord? : `" +
            swearBadword.animalBool +
            `\`\nTempPoints : \`${
              null // client.qky["badword"][message.author.id]
            }\`\nSended in <#${message.channel.id}>, by <@${message.author.id}>`,
          color: 0xfa1212,
          author: {
            name: message.author.tag,
            icon_url: message.member.user.avatarURL({
              format: "png",
              dynamic: true
            } as Discord.ImageURLOptions)
          }
        }
      ]
    });

    // if (config.resendCensored) {
    const theReportButton = new Discord.ButtonBuilder()
      .setCustomId(`reportbadword,${swearBadword.word.join("|")}`)
      .setLabel("Complain False-Positive!")
      .setStyle(Discord.ButtonStyle.Danger)
      .setEmoji("⚠️" as Discord.EmojiResolvable);
    if (false) {
      sendWebhookByChannel(client, message.channel.id, {
        username: message.member.displayName,
        content: str
          .replace(new RegExp(`(${swearBadword.pattern.join("|")})`, "gi"), "[Content Deleted]")
          .replace(/(<[a@][i&]?\d+>|[a@]everyone|[a@]here)/gi, "[[Mention]]")
          .replace(/(<\w+\d+>)/gi, "[[Emoji]]"),
        avatar_url: message.member.user.avatarURL({
          format: "png",
          dynamic: true
        } as Discord.ImageURLOptions)
      });
      return message.delete();
    } else if (
      !config.isAdminAllowed &&
      message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)
    ) {
      message.react("⚠");
      return message.channel
        .send({
          content: (
            rndmizer(config.response.admin) ??
            'Sorry! because of "Members Equality" you cant say the word, and its applied to all members included Admin and Owner'
          ).replace(/\{([\w\s']+)\}/gi, replacer),
          components: [new Discord.ActionRowBuilder().addComponents(theReportButton)]
        } as any)
        .then((m) => {
          setTimeout(function () {
            m.delete();
          }, 60000);
        });
    } else if (!config.silent) {
      message.channel
        .send({
          content: (rndmizer(config.response.normal) ?? "Hey {user}! You aren't allowed to say that!").replace(
            /\{([\w\s']+)\}/gi,
            replacer
          ),
          components: [new Discord.ActionRowBuilder().addComponents(theReportButton)]
        } as any)
        .then((m) => {
          setTimeout(function () {
            m.delete();
          }, 60000);
        });
      return message.delete();
    } else {
      message.channel
        .send({
          components: [new Discord.ActionRowBuilder().addComponents(theReportButton)]
        } as any)
        .then((m) => {
          setTimeout(function () {
            m.delete();
          }, 60000);
        });
      return message.delete();
    }
  }
}

function replaceCommon(s) {
  return specialReplacer(
    s
      .toLowerCase()
      .replace(/([=,_.+#%^&*()|/\\\-:;{}\[\]"'`]|([!\?]+(\s+|\B))|(\s{3.})|(\udb40[\udc00-\udfff]))/gi, "")
      .replace(/(\b[a-z0-9]{1})(\s|\n|\n\r|\r\n)+/gi, "$1")
  );
}

// function FilterWords(config, str) {
// }
