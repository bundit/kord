export function capitalizeWord(word) {
  if (!word || !word.length) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}
