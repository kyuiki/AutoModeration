import * as Discord from "discord.js";
import log4 from "../../functions/log4";

export default {
  initial: {
    guildID: "956877285754015804"
  },
  async exec(client: Discord.Client, member: Discord.GuildMember) {
    const thisMember: Discord.GuildMember | boolean = await client.guilds.cache
      .get("368769930029563906")
      .members.fetch(member.user.id)
      .catch(() => false);
    const thisPrivMember: Discord.GuildMember | boolean = await client.guilds.cache
      .get("774903123114197003")
      .members.fetch(member.user.id)
      .catch(() => false);
    if (!thisMember && !thisPrivMember)
      return (member.guild.channels.cache.get("956894667792875563") as Discord.TextChannel).send(
        "(" +
          member.user.tag +
          ") **Sebentar... :'**\nKamu kelihatannya sangat asing bagi kami...\nDari mana kamu dapat invite ini?\nSiapa teman dekatmu?"
      );
    if (thisPrivMember) member.roles.add("956885025536745502");
    member.roles.add("956884957786144798");
    (member.guild.channels.cache.get("956914749126373426") as Discord.TextChannel).send(
      `Selamat datang kembali ${member.user} :3 Kamu terverifikasi xD dan... jangan keluar lagi yah... xD`
    );
  }
};
