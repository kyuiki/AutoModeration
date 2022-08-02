import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "../../functions/log4";
import * as mongoose from "mongoose";
import * as dayjs from "dayjs";
import * as relativeness from "dayjs/plugin/relativeTime";

dayjs.extend(relativeness);

const uri = `mongodb+srv://${process.env.MONGODB}/db?retryWrites=true&w=majority`;
mongoose.connect(uri);
const prefix = "";

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  log4.success("Connected successfully to database!");
});

const whitelistSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    mcName: {
      type: String,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    }
  }),
  waitlist = mongoose.model("waitlist", whitelistSchema);

// This above is whitelist schemana mana

export default {
  initial: {
    guildID: "956877285754015804"
  },
  messageCreate: async (client: Discord.Client, message: Discord.Message) => {
    // Channel Checking
    if (message.channel.id) return;
    const args = { array: [], parsed: { string: "none" } };
    // Role Checking
    const hasThisRole = message.member.roles.cache.has("956949376977231972");
    if (hasThisRole) message.react("");

    // Search This user in Database Lol
    const searchwl = await waitlist.findOne({ userId: message.author.id });
    if (30 * (1000 * 60 ** 2 * 24) + searchwl?.timestamp > new Date().valueOf())
      return message.reply(
        `Bro.. you need to wait atleast for ${dayjs().from(
          dayjs(30 * (1000 * 60 ** 2 * 24) + searchwl?.timestamp),
          true
        )} 💀💀💀`
      );

    // No Argument?
    if (!(args.parsed.string ?? args.array[0])) return message.react("❓");

    // Search this mf minecraft UUID
    const playerResult = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${args.parsed.string ?? args.array[0]}`
    );
    if (!playerResult.ok || playerResult.status == 204) {
      return message.react("❓");
    }
    console.log(playerResult.status);
    const player = await playerResult.json();

    // Add that mf into willies
    fetch("https://api.qky.life/api/gallery", {
      method: "POST",
      headers: { key: process.env.MINECRAFTNAKKI },
      body: `name=${player.name}&uuid=${player.id}`
    })
      .then(async (x) => {
        const res = await x.text();
        // mf have bad shit
        if (!x.ok) {
          message.reply("utterly unexcuseable!");
          return log4.error("No!");
        }
        if (res.includes("failed") || res.includes("No whitelist")) {
          message.reply("Error, Failed! Whitelist is disabled or Failed");
          message.react("⚠️");
          return;
        }
        if (res.includes("Error: duplicate entry")) {
          message.reply("Error, Duplicated! This user already exist");
          message.react("⚠️");
          return;
        }

        log4.info(
          await new waitlist({
            userId: message.author.id,
            mcName: player.name,
            timestamp: new Date().valueOf()
          }).save()
        );

        message.reply({
          content: "Great Response!",
          embeds: [
            {
              title: `(The Output My Darl)`,
              description: `HTTP Status : ${x.status}\nOutput : \`\`\`${res}\`\`\`` //stringifyObj(xj).match(/(.|\s){1,4000}/gi)[0]
            }
          ]
        });
      })
      .catch((e) => {
        log4.error("ErrorNo!", e);
        message.reply("utterly unexcuseable!");
      });
  }
};

// export default {};
