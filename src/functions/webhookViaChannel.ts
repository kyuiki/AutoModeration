import * as Discord from "discord.js";
import fetch from "node-fetch";
import log4 from "./log4";

export async function sendWebhookByChannel(client: any, channel: string, data: any) {
  client.channels.cache
    .get(channel)
    .guild.fetchWebhooks()
    .then(async (a) => {
      const w = a
        .filter((b) => b.channelId == channel && b.owner.id == client.user.id)
        .values()
        .next().value;
      if (!w) {
        log4.error("Webhook not found! creating new one...");
        await client.channels.cache
          .get(channel)
          .createWebhook({
            name: "Qky's Intended Webhook",
            reason: "Needed a webhook because it doesnt have a webhook"
          })
          .then(() => {
            sendWebhookByChannel(client, channel, data);
          })
          .catch((e) => {
            client.channels.cache
              .get(channel)
              .send("Umm... I dont have permission to create new Webhook because this channel doesnt have webhook");
            log4.error("Failed to create the webhook! ", e);
          });
        return log4.log("Restarting when Created..");
      }
      // Detect if Token
      if (!w.token) return log4.warn("Its said no token!", w);
      fetch(`https://discordapp.com/api/webhooks/${w.id}/${w.token}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" }
      })
        .then(async (r) => {
          if (!r.ok) return log4.error("uhh => ", r.status, await r.text());
          log4.success("Webhook Successfully Sended");
        })
        .then((e) => log4.error(e));
    });
}
