"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Manifesto.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.manifestoSection}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 ref={textRef} className={styles.headline}>
            Lean, fast, and ruthless with execution, Studio Luxe is built for companies that care about <span className={styles.highlight}>delivering a premium brand experience to their customers .</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
