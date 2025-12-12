"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./OurValues.module.css";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const values = [
  "Uncompromising craftmanship",
  "Client-centric",
  "Sustainable",
  "Brand storytelling",
  "Ethical",
  "Evolution",
  "kindness",
  "culture",
  "transparency",
  "commitment",
  "quality",
  "people",
  "transformation",
  "creativity",
  "innovation"
];

export default function OurValues() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for pills (mirrored from services: enter from Left)
      gsap.from(".value-pill", {
        x: -100, // From Left
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: pillsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Idle float animation
      gsap.to(".value-pill", {
        y: "random(-8, 8)",
        x: "random(-5, 5)", // Add slight X drift too
        rotation: "random(-1, 1)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 2,
            from: "random"
        }
      });

      // Text content animation
      gsap.from(`.${styles.rightCol} > *`, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.valuesSection}>
      <div className={styles.container}>
        
        <div className={styles.label}>
             <span className={styles.squareIcon}></span>
             OUR VALUES
        </div>

        {/* Left Column - Pills */}
        <div className={styles.leftCol} ref={pillsRef}>
            {values.map((val, index) => (
                <div 
                    key={index} 
                    className={`${styles.pill} value-pill ${styles[`offset_${index % 10}`]}`} 
                    data-cursor="hover"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, backgroundColor: "var(--foreground)", color: "var(--background)", duration: 0.3 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, backgroundColor: "transparent", color: "var(--foreground)", duration: 0.3 })}
                >
                    {val}
                </div>
            ))}
        </div>

        {/* Right Column - Text */}
        <div className={styles.rightCol}>
            <p className={styles.description}>
                At studio luxe, we develop, and optimises flawless and user-centred digital products. We're dedicated to elevating brands.
            </p>
            
            <div className={styles.ctaGroup}>
                <button className={styles.bookBtn} data-cursor="hover">Book intro</button>
                <button className={styles.arrowBtn} data-cursor="hover">
                    <Image 
                        src="/Luxe Studio/ArrowUpRight.svg" 
                        alt="Arrow" 
                        width={20} 
                        height={20} 
                        style={{ filter: "invert(1)" }}
                        className={styles.btnIcon} 
                    />
                </button>
            </div>
        </div>

      </div>
    </section>
  );
}
