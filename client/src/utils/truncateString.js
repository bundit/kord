export default function truncateString(string, maxLen) {
  if (string && string.length > maxLen) {
    const subStr = string.slice(0, maxLen);

    return `${subStr}...`;
  }

  return string;
}
