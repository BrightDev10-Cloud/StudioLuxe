"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./ServicesCloud.module.css";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Brand Design",
  "Product Design",
  "Design Systems",
  "Custom Mobile App design & Development",
  "Custom Website and E-commerce design & Development",
  "Event Branding and Artifact Development",
  "Content Development",
  "Motion Design",
  "Ongoing design support",
  "Cloud/AI Automations",
  "Consultancy"
];

export default function ServicesCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation (Idle)
      gsap.to(".service-pill", {
        y: "random(-10, 10)",
        rotation: "random(-2, 2)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 1.5,
            from: "random"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.servicesSection}>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.leftCol}>
            <div className={styles.label}>
                <span className={styles.squareIcon}></span>
                WHAT WE OFFER
            </div>
            
            <p className={styles.description}>
                Our ideal client are companies with a strong sense of style and brand presence looking to elevate their image and expand into new market in the luxury sector and businesses seeking a design partner to establish a premium brand identity.
            </p>
            
            <div className={styles.ctaGroup}>
                <button className={styles.bookBtn} data-cursor="hover">Book Intro</button>
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

        {/* Right Column - Pills with Offsets */}
        <div className={styles.rightCol} ref={pillsRef}>
            {services.map((service, index) => (
                <div 
                    key={index} 
                    className={`${styles.pill} service-pill ${styles[`offset_${index % 10}`]}`} 
                    data-cursor="hover"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" })}
                >
                    {service}
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
