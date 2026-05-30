import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (hash) {
      const frameId = requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToTop;
