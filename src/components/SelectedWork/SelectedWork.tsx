"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./SelectedWork.module.css";
import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects.json";

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(projectsData[0].image);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Initial list animation
        gsap.from(".project-item", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Mouse follower for preview
        const xTo = gsap.quickTo(previewRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(previewRef.current, "y", { duration: 0.4, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
        }
        
        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (image: string) => {
      setActiveImage(image);
      gsap.to(previewRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
      });
  };

  const handleMouseLeave = () => {
      gsap.to(previewRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in"
      });
  };

  return (
    <section ref={containerRef} className={styles.workSection} onMouseLeave={handleMouseLeave}>
        {/* Floating Preview Image */}
        <div ref={previewRef} className={styles.previewOverlay}>
            <Image 
                src={activeImage} 
                alt="Project Preview" 
                width={400} 
                height={500} 
                className={styles.previewImage}
                priority
            />
        </div>

      <div className={styles.container}>
        <div className={styles.label}>
            <span className={styles.squareIcon}></span>
            SELECTED WORK
        </div>

        <div className={styles.projectList} onMouseLeave={handleMouseLeave}>
            {projectsData.map((project, index) => (
                <Link 
                    href="#" 
                    key={index} 
                    className={`${styles.projectItem} project-item`} 
                    data-cursor="hover"
                    onMouseEnter={() => handleMouseEnter(project.image)}
                >
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <span className={styles.projectTag}>{project.tags}</span>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
