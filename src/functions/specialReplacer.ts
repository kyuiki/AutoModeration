// import word from "../json/specialCharacters.json"
/**
 * Transform almost any zalgo text into readable text to bot
 * @param input String that you want to replace
 * @returns 
 */
export function specialReplacer(input:string):string{
    input = input.replace(/[\ud835\ud83c]/gi, "");
    const word = require("../json/specialCharacters.json");
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (const letter of letters.split("")) {
        input = input.replace(new RegExp(`[${word[letter]}]`, "gi"), letter);
    }
    return input
}
