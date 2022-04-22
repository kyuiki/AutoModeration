import log4 from "./log4";
import * as Discord from "discord.js";
class Logger {
  userID: string;
  imLogging: boolean = true;
  constructor(id: string) {
    this.userID = id;
  }
  delete() {
    log4.info(
      `Stopping logging action to all servers from this user (${this.userID})`
    );
  }
  start() {
    log4.info(
      `Starting logging action to all servers to this user (${this.userID})`
    );
  }
  chat(message: Discord.Message) {
    log4.log(
      `[${message.guild.name}/${
        (message.channel as Discord.TextChannel | Discord.ThreadChannel).name
      }][${message.author.tag}]:  ${message.cleanContent}`
    );
  }
}

export default Logger;
