import * as day from "dayjs";
import * as c from "colors/safe";
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
    console.log(
      c.gray(
        `${c[`bg${color}`]("Log4J")}[${this.date()} ${c[color.toLowerCase()](
          type
        )}]:`
      ),

      ...message.map((x) => (typeof x === "string" ? c.gray(x) : x))
    );
  }
  private date() {
    return c.white(day().format("HH:mm:ss"));
  }
}

/**
 * Qky simple clean logging, Use this for clean logging and something else
 */
export default new Logging();
