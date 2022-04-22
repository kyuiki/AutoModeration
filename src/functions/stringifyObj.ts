export default function (obj: any) {
  return objToString(obj);
}

function objToString(obj: any, space: number = 0) {
  return Object.entries(obj).reduce((str, [p, val]) => {
    if (typeof val != "object") return `${str}${"-".repeat(space)}**${p}** : \` ${val} \`\n`;
    return `${str}${"-".repeat(space)}**${p}** :\n${objToString(val, space + 1)}`;
  }, "");
}
