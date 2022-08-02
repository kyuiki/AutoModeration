/**
 * Simple Character Randomizer
 * @param length Length of generation
 * @param letter Its not a letter but rather keywords like 0Aa.
 */
export default (length:number, letter:string):string => {
    var multiplier:string = '';
    if (letter.indexOf('0') > -1) multiplier += '0123456789';
    if (letter.indexOf('A') > -1) multiplier += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (letter.indexOf('a') > -1) multiplier += 'abcdefghijklmnopqrstuvwxyz';
    if (letter.indexOf('.') > -1) multiplier += '.-_'
    var results:string = '';
        for (var i = length; i > 0; --i) {
        results += multiplier[Math.floor(Math.random() * multiplier.length)]; }
    return results; 
}