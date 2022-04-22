import * as Discord from "discord.js";
const words = require("./word_config.json").words;

interface BadWordsInterface {
  word: string[];
  pattern: string[];
  swearBool: boolean;
  animalBool: boolean;
}

export default async function (
  client: Discord.Client,
  message: Discord.Message,
  old?: Discord.Message
) {
  if (
    (message.channel as Discord.TextChannel).nsfw &&
    config["isNSFWChannelAllowed"]
  )
    return;
  if (
    config.filterChannels?.list?.length &&
    config.filterChannels?.list?.includes(message.channel.id) !==
      config.filterChannels?.invert
  )
    return console.log("This Channel is allowed");

  var str = message.cleanContent
    .toLowerCase()
    .replace(
      /([=,_.+#%^&*()|/\\\-:;{}\[\]"'`]|([!\?]+(\s+|\B))|(\s{3.})|(\udb40[\udc00-\udfff]))/gi,
      ""
    )
    .replace(/(\b[a-z0-9]{1})(\s|\n|\n\r|\r\n)+/gi, "$1");
  // console.log(str)
  let before = "",
    badwords = [],
    animal = words.animal.list,
    swearBadword: BadWordsInterface = {
      word: [],
      pattern: [],
      swearBool: false,
      animalBool: false,
    };
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
  if (config.config["custom"].length > 0)
    badwords.push(...config.config["custom"]);
  if (config.config["emoji"]) {
    str = str.replace(
      new RegExp(words.emoji.config, "giu"),
      `banned_emoji${client.func.getRandom(4, "0")}`
    );
    badwords.push(...words.emoji.list);
  }
  // console.log(config.config["custom"].length > 0, config.config["custom"], badwords)
  str = client.func.specialReplacer(str);
  // console.table(badwords)

  for (var i in badwords) {
    if (str.match(new RegExp(badwords[i], "gi"))) {
      swearBadword.swearBool = true;
      swearBadword.pattern.push(badwords[i]);
      swearBadword.word.push(...str.match(new RegExp(badwords[i], "gi")));
      console.log(swearBadword.word);
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

  // The Response
  if (
    swearBadword.swearBool ||
    (swearBadword.animalBool && !str.includes("hewan"))
  )
    badwordResponse();

  // The Functions
  function badwordResponse() {
    console.log("Badword test Output > ", swearBadword, swearBadword);

    if (
      config.isAdminAllowed &&
      message.member.permissions.has("ADMINISTRATOR")
    )
      return console.log("Admin is allowed");
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      if (client.qky["badword"][message.author.id])
        client.qky["badword"][message.author.id] += swearBadword.word.length;
      else client.qky["badword"][message.author.id] = swearBadword.word.length;
    }
    client.func.sendWebhookByChannel(client, config.channel, {
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
              client.qky["badword"][message.author.id]
            }\`\nDia bilang seperti itu di channel <#${
              message.channel.id
            }>. Dia adalah <@${message.author.id}>`,
          color: 0xfa1212,
          author: {
            name: message.author.tag,
            icon_url: message.member.user.avatarURL({
              format: "png",
              dynamic: true,
            }),
          },
        },
      ],
    });

    if (config.resendCensored) {
      client.func.sendWebhookByChannel(client, message.channel.id, {
        username: message.member.displayName,
        content:
          `[${client.qky["badword"][message.author.id]}/5] ` +
          str
            .replace(
              new RegExp(`(${swearBadword.pattern.join("|")})`, "gi"),
              "**[Censored]**"
            )
            .replace(/(<[a@][i&]?\d+>|[a@]everyone|[a@]here)/gi, "[[Mention]]")
            .replace(/(<\w+\d+>)/gi, "[[Emoji]]"),
        avatar_url: message.member.user.avatarURL({
          format: "png",
          dynamic: true,
        }),
      });
      return message.delete();
    } else if (
      !config.isAdminAllowed &&
      message.member.permissions.has("ADMINISTRATOR")
    ) {
      message.react("⚠");
      return message.channel
        .send(
          (
            rndmizer(config.response.admin) ??
            'Sorry! because of "Members Equality" you cant say the "{word}" word, and its applied to all members included Admin and Owner'
          ).replace(/\{([\w\s']+)\}/gi, replacer),
          { percentage: 0.05, includeSpace: true }
        )
        .then((m) => {
          setTimeout(function () {
            m.delete();
          }, 20000);
        });
    } else if (!config.silent) {
      message.channel
        .send(
          `[${client.qky["badword"][message.author.id]}/5] ` +
            (
              rndmizer(config.response.normal) ??
              'Hey {user}! You arent allowed to say "{word}"!'
            ).replace(/\{([\w\s']+)\}/gi, replacer)
        )
        .then((m) => {
          setTimeout(function () {
            m.delete();
          }, 20000);
        });
      return message.delete();
    } else {
      message.delete();
    }
  }
}
