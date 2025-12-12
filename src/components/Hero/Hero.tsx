"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import HalftoneWave from "./HalftoneWave";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(textRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 2.2 // Wait for preloader
        });
        
        gsap.to(textRef.current, {
            y: -200,
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      <HalftoneWave />
      <div className={styles.content}>
        <h1 ref={textRef} className={styles.headline}>
          Full-Stack Cloud/AI Native <br />
          Product Design & Development Studio.
        </h1>
        {/* <div className={styles.subheadline}>
            Lean, fast, and ruthless with execution. Studio Luxe is built for companies that want to elevate their brand experience.
        </div> */}
      </div>
      {/* <div className={styles.scrollIndicator}>
          ( SCROLL DOWN)
      </div> */}
    </section>
  );
}
