export default function useMobileDetection() {
  if (process.env.NODE_ENV !== "development" && typeof window !== "undefined") {
    return navigator.userAgent.match(
      /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
    );
  }

  return false;
}
