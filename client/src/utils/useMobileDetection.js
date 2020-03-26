import { useState, useEffect } from "react";

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  function handleResize() {
    setIsMobile(window.innerWidth < 800);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
