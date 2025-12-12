"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <Link href="/" className={styles.brand} data-cursor="hover">
        <Image 
            src="/Luxe Studio/logo_icon.svg" 
            alt="StudioLuxe Icon" 
            width={24} 
            height={24} 
            className={styles.logoIcon}
            style={{ width: 'auto', height: 'auto' }}
        />
        <Image
            src="/Luxe Studio/Luxe_studio_woodmark.svg"
            alt="StudioLuxe"
            width={120}
            height={24}
            className={styles.woodmark}
            style={{ width: 'auto', height: 'auto' }}
        />
      </Link>

      <div className={styles.actions}>
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme" data-cursor="hover">
           {mounted && (
               <Image 
                 src="/Luxe Studio/SunDim.svg" 
                 alt="Theme Toggle" 
                 width={24} 
                 height={24}
                 className={styles.themeIcon}
               />
           )}
        </button>

        <Link href="/contact" className={styles.hireBtn} data-cursor="hover">
          <span>Hire us</span>
        </Link>
      </div>
    </nav>
  );
}
