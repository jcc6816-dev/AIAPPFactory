"use client";

import { useEffect } from "react";

function scrollToHash() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return;

  const target = document.getElementById(decodeURIComponent(hash));
  if (!target) return;

  target.scrollIntoView({ block: "start", behavior: "auto" });
}

export default function HashAnchorScroller() {
  useEffect(() => {
    const scheduleScroll = () => {
      [0, 150, 500, 1200, 2200].forEach((delay) => {
        window.setTimeout(scrollToHash, delay);
      });
    };

    scheduleScroll();
    window.addEventListener("hashchange", scheduleScroll);
    window.addEventListener("load", scheduleScroll);

    return () => {
      window.removeEventListener("hashchange", scheduleScroll);
      window.removeEventListener("load", scheduleScroll);
    };
  }, []);

  return null;
}
