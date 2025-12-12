"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Team.module.css";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Abdulazeez Abu",
    role: "Founder & Creative Director",
    subRole: "FullStack Cloud/AI Solution Architect",
    image: "/team/abdul.jpg"
  },
  {
    name: "Terry Ogenz",
    role: "Sales/Marketing Lead",
    image: "/team/LuxeStudio/Terry.png"
  },
  {
    name: "Ruth Abu",
    role: "Media/Operations Lead",
    image: "/team/ruth.png"
  }
];

export default function Team() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".member-card", 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2, // Stagger animation matching the visual stagger layout
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.teamSection}>
      <div>
        <div className={styles.label}>
            <span className={styles.squareIcon}></span>
            OUR TEAM
        </div>

        <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
                <div key={index} className={`${styles.memberCard} member-card`}>
                    <div className={styles.imageWrapper}>
                         <div className={styles.imageOverlay}></div>
                         <Image 
                            src={member.image} 
                            alt={member.name} 
                            width={400} 
                            height={500} 
                            className={styles.memberImage}
                         />
                    </div>
                    <div className={styles.info}>
                        <h3 className={styles.name}>{member.name}</h3>
                        <p className={styles.role}>{member.role}</p>
                        {member.subRole && <p className={styles.subRole}>{member.subRole}</p>}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* <div className={styles.footerRow}>
          <div className={styles.footerCol}>
              <span className={styles.colTitle}>Mail</span>
              <a href="mailto:hello@studioluxe.xyz" className={styles.colText}>hello@studioluxe.xyz</a>
          </div>
          <div className={styles.footerCol}>
              <span className={styles.colTitle}>Office</span>
              <span className={styles.colText}>Remote/Global</span>
          </div>
          <div className={styles.footerCol}>
               <span className={styles.colTitle}>Social</span>
               <a href="#" className={styles.colText}>LinkedIn</a>
          </div>
      </div> */}

    </section>
  );
}
