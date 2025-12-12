"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Counter animation
        const counterObj = { value: 0 };
        gsap.to(counterObj, {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                setCount(Math.round(counterObj.value));
            },
            onComplete: () => {
                // Exit animation
                gsap.to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    display: "none"
                });
            }
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div ref={counterRef} className={styles.counter}>
        {count}%
      </div>
      <div className={styles.text}>StudioLuxe</div>
    </div>
  );
}
