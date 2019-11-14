export default function msToDuration(duration) {
  const base = 10;

  let seconds = parseInt((duration / 1000) % 60, base);
  const minutes = parseInt((duration / (1000 * 60)) % 60, base);
  const hours = parseInt((duration / (1000 * 60 * 60)) % 24, base);

  seconds = seconds < 10 ? `0${seconds}` : seconds;

  if (hours >= 1) {
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
