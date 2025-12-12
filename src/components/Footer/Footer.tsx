"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaDribbble, FaLinkedinIn, FaStar, FaGlobe } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";

export default function Footer() {
  return (
    <footer className={styles.footerSection}>
      
      {/* Top Row */}
      <div className={styles.topRow}>
        <div className={styles.logo}>
             <Image 
               src="/Luxe Studio/logo_icon.svg" 
               alt="Studio Luxe Icon" 
               width={40} 
               height={40} 
             />
             <Image 
               src="/Luxe Studio/Luxe_studio_woodmark.svg" 
               alt="Studio Luxe" 
               width={180} 
               height={40}
               className={styles.woodmark}
             />
        </div>

        <div className={styles.ctaCenter}>
             <div className={styles.halftoneBg}></div>
             <h2 className={styles.jamText}>Let's Jam.</h2>
        </div>

        <div className={styles.actionRight}>
             <Link href="/contact" className={styles.getStartedBtn}>
                <span>↗</span> Get Started
             </Link>
             
             <div className={styles.chatPrompt}>
                <div className={styles.avatars}>
                    <Image src="/team/abdul.jpg" alt="User" width={32} height={32} className={styles.avatar} />
                    <Image src="/team/LuxeStudio/Terry.png" alt="User" width={32} height={32} className={styles.avatar} />
                    <Image src="/team/ruth.png" alt="User" width={32} height={32} className={styles.avatar} />
                </div>
                <p className={styles.chatText}>
                    We're always up for a coffee and a chat, <br />
                    <a href="#" className={styles.chatLink}>Send us a message</a> and we'll get back to you!
                </p>
             </div>
        </div>
      </div>

      {/* Social Grid */}
      <div className={styles.socialGrid}>
          <Link href="#" className={styles.socialCard}>
              <span className={styles.socialIcon}>W.</span>
              <span className={styles.socialName}>Awwwards</span>
          </Link>
          <Link href="#" className={styles.socialCard}>
              <FaGlobe className={styles.socialIcon} />
              <span className={styles.socialName}>Clutch</span>
          </Link>
          <Link href="#" className={styles.socialCard}>
              <FaInstagram className={styles.socialIcon} />
              <span className={styles.socialName}>Instagram</span>
          </Link>
          <Link href="#" className={styles.socialCard}>
              <FaDribbble className={styles.socialIcon} />
              <span className={styles.socialName}>Dribbble</span>
          </Link>
          <Link href="#" className={styles.socialCard}>
              <SiSubstack className={styles.socialIcon} />
              <span className={styles.socialName}>Substack</span>
          </Link>
          <Link href="#" className={styles.socialCard}>
              <FaLinkedinIn className={styles.socialIcon} />
              <span className={styles.socialName}>LinkedIn</span>
          </Link>
      </div>

      {/* Bottom Footer */}
      <div className={styles.bottomFooter}>
          <span>{new Date().getFullYear()} © StudioLuxe Labs</span>
          <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>Our Credentials</Link>
              <Link href="#" className={styles.footerLink}>Terms & Conditions</Link>
              <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
          </div>
      </div>

    </footer>
  );
}
