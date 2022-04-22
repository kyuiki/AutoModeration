import fetch from "node-fetch";
import * as ms from "ms";
import * as crypto from "crypto";
import * as Discord from "discord.js";
import log4 from "../functions/log4";

let domainList: string[];
let badDomainList: string[];
let termsList: string[];
let embedsList: string[] = [
  "Yоu've been giftеd а subscriptiоn", //clever russian characters
  "You've been gifted a subscription",
  "3 months of Discord Nitro",
  "Nitro free from STEAM",
  "Nitro for 3 Months",
];

// let domainList: string[];

fetch("https://cdn.discordapp.com/bad-domains/hashes.json").then(async (r) => {
  if (!r.ok) throw "Not Ok!";
  domainList = await r.json();
  log4.success(`The bad domain is ready!`);
});
fetch(
  "https://raw.githubusercontent.com/nikolaischunk/discord-phishing-links/main/domain-list.json"
).then(async (r) => {
  if (!r.ok) throw "Not Ok!";
  badDomainList = (await r.json()).domains;
  log4.success(`The bad domain is ready!`);
});
fetch(
  "https://raw.githubusercontent.com/DevSpen/scam-links/master/src/malicious-terms.txt"
).then(async (r) => {
  if (!r.ok) throw "Not Ok!";
  termsList = (await r.text()).split("\n");
  termsList.pop();
  log4.success(`The bad terms is ready!`);
});

export default async (client: Discord.Client, message: Discord.Message) => {
  // log4.error("Get ya!", domainList);
  const getUrls = message.cleanContent.match(
    /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g
  );
  const getUrlsHashed = getUrls?.map((x) => {
    return crypto.createHash("sha256").update(x).digest("hex");
  });

  const banCompromised = () => {
      message.react("💥");

      if (!message.member.bannable) {
        log4.error(
          `Failed to ban compromised account (${message.author.tag} / ${message.author.id}). My perms might not high enough or it was the owner of the server`
        );
        return message.react("❌");
      }
      message.guild.bans
        .create(message.member, {
          days: 7,
          reason: `Banned Automatically by System (Compromised Account)`,
        })
        .then(() => {
          log4.success(
            `Successfully banned compromised account (${message.author.tag} / ${message.author.id})`
          );
          message.delete().catch(() => {
            log4.error("Message Already Deleted!");
          });
        })
        .catch((e) => {
          log4.error(
            `Failed to ban compromised account (${message.author.tag} / ${message.author.id}). My perms might not high enough or it was the owner of the server`
          );
          message.react("❌");
          // log4.error(e);
        });
    },
    TimeoutCompromised = () => {
      message.react("💥");
      message.member
        .timeout(
          ms("21d"),
          `Timeouted Automatically by System (Compromised Account)`
        )
        .then(() => {
          log4.success(
            `Successfully Timeout-ed compromised account (${message.author.tag} / ${message.author.id})`
          );
          message.delete().catch(() => {
            log4.error("Message Already Deleted!");
          });
        })
        .catch((e) => {
          log4.error(
            `Failed to timeout compromised account (${message.author.tag} / ${message.author.id}). My perms might not high enough or it was the owner of the server`
          );
          message.react("❌");
          // log4.error(e);
        });
    };

  if (!getUrls) return;
  getUrlsHashed.forEach((url) => {
    if (domainList.includes(url)) {
      log4.success("Suspicious Link Detected! Running next execution");
      banCompromised();
    }
  });
  getUrls.forEach((url) => {
    if (badDomainList.includes(url)) {
      log4.success("Suspicious Link Detected! Running next execution");
      banCompromised();
    }
  });
  for (const embed of embedsList) {
    const x = message.embeds?.[0]?.title;
    if (x && x.toLowerCase().includes(embed.toLowerCase())) {
      if (getUrls.includes("discord.com")) break;
      log4.success("Suspicious Embed Terms Detected! Running next execution");
      TimeoutCompromised();
      break;
    }
  }
  for (const term of termsList) {
    if (message.cleanContent.includes(term)) {
      log4.success("Suspicious Words Terms Detected! Running next execution");
      TimeoutCompromised();
      break;
    }
  }
  // log4.error(getUrls);
};
