"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      });
    };

    const handleHover = () => {
        follower.classList.add(styles.cursorHover);
    };

    const handleUnhover = () => {
        follower.classList.remove(styles.cursorHover);
    };

    window.addEventListener("mousemove", moveCursor);

    // Add event listeners to all links and buttons
    const links = document.querySelectorAll("a, button, [data-cursor='hover']");
    links.forEach((link) => {
        link.addEventListener("mouseenter", handleHover);
        link.addEventListener("mouseleave", handleUnhover);
    });

    // Observer to handle dynamic content
    const observer = new MutationObserver(() => {
        const newLinks = document.querySelectorAll("a, button, [data-cursor='hover']");
        newLinks.forEach((link) => {
            link.addEventListener("mouseenter", handleHover);
            link.addEventListener("mouseleave", handleUnhover);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      links.forEach((link) => {
          link.removeEventListener("mouseenter", handleHover);
          link.removeEventListener("mouseleave", handleUnhover);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={styles.cursor} />
      <div ref={followerRef} className={styles.cursorFollower} />
    </>
  );
}
