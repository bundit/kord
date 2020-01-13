export default function secondsToFormatted(total) {
  const base = 10;
  const hours = parseInt((total / (60 * 60)) % 24, base);
  const minutes = parseInt((total / 60) % 60, base);
  const seconds = parseInt(total % 60, base);

  if (hours > 1) {
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
