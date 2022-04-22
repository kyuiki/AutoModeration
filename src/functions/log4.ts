import * as day from "dayjs";
import * as c from "colors/safe";
import * as Discord from "discord.js";
require("dotenv-flow").config();

const whlogging = process.env["WEBHOOKLOG"]?.split("/");
const webhook = whlogging
  ? new Discord.WebhookClient({
      id: whlogging[0],
      token: whlogging[1],
    })
  : null;
class Logging {
  /**
   * for Error Message (Red)
   * @param message
   */
  public error(...message) {
    this.sendConsole("Red", "ERROR", ...message);
  }
  /**
   * For Information Message (Cyan)
   * @param message
   */
  public info(...message) {
    this.sendConsole("Cyan", "INFO", ...message);
  }
  /**
   * For Logging Message (Blue)
   * @param message
   */
  public log(...message) {
    this.sendConsole("Blue", "LOG", ...message);
  }
  /**
   * For Warning Message (Yellow)
   * @param message
   */
  public warn(...message) {
    this.sendConsole("Yellow", "WARN", ...message);
  }
  /**
   * For Success Message (Green)
   * @param message
   */
  public success(...message) {
    this.sendConsole("Green", "SUCCESS", ...message);
  }
  private sendConsole(color: string, type: string, ...message) {
    let log = c.gray(
      `${c[`bg${color}`]("  ")}[${this.date()} ${c[color.toLowerCase()](
        type
      )}]:`
    );
    let logClean = log.replace(/\[.{2}m/gi, "").replace("Log4J", "");
    console.log(
      log,
      ...message.map((x) => (typeof x === "string" ? c.gray(x) : x))
    );
    if (
      !webhook ||
      message.filter((x) => !["string", "number"].includes(typeof x)).length
    )
      return;
    webhook.send({
      content: logClean + `\`\`${message.join(" ")}\`\``,
      threadId: whlogging[2] ?? null,
      // allowed_mentions: { parse: [] },
    });
  }
  private date() {
    return c.white(day().format("HH:mm:ss"));
  }
}

/**
 * Qky simple clean logging, Use this for clean logging and something else
 */
export default new Logging();
