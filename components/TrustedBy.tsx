"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const logos: string[] = [
  "/images/logos/Codera.png",
  "https://www.fynhaus.com/wp-content/uploads/2021/11/fynhaus_website_header_logo_170.png",
  "/images/logos/sunoida.png",
  "https://static.wixstatic.com/media/2984b2_88180e1bf1854edbbc645925e66bd483~mv2.png/v1/fill/w_368,h_207,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo_PNG_Black.png",
  "https://www.crt.hr/assets/images/logo_v2.svg",
  "https://www.synaptique.com/wp-content/uploads/2024/07/synaptique_blk.svg",
  "/images/logos/ap.png",
  "/images/logos/complyadv.png",
  "/images/logos/oomero.png",
];

const logos2: string[] = [
  "/images/logos/docfox.png",
  "https://www.globalvoicegroup.com/wp-content/uploads/2024/03/GVG_Logo.png",
  "https://accurascan.com/wp-content/uploads/2023/04/purple_logo_accura.webp",
  "https://aml-analytics.com/wp-content/uploads/2024/08/Group-171810.svg",
  "https://cdn.cookielaw.org/logos/fefee38f-fbda-471c-b52e-14950b7224fb/a465bd03-c0a1-48f3-879c-65e33529ae1a/6c00783e-034b-4f48-8374-8e22a7ff4eab/logo-fenergo-fond-clair-couleur@3x.png",
  "https://cdn.cookielaw.org/logos/047cfe2c-0e7b-4a56-81fc-d8b6832dbcfc/7a6490b3-2d4f-479d-9d5f-e94073ccf155/483faafa-99a0-4498-90fa-752354262e26/dnv_logo@2x.png",
  "/images/logos/elucidate.png",
  "/images/logos/amlp.png",
  "/images/logos/regcompass.png",
  "/images/logos/Fineksus-Logo.png",
];

const logos3: string[] = [
  "/images/logos/hotfoot.png",
  "https://vanrise.com/wp-content/uploads/2021/06/logo-vanrise.svg",
  "/images/logos/fintellix.png",
  "/images/logos/regos.png",
  "/images/logos/loopai.png",
  "https://ft-solutions.com/wp-content/uploads/2017/02/logo.png",
  "/images/logos/gh.png",
  "/images/logos/sumsub.png",
  "/images/logos/youverify.png",
];

// Render one scrolling row of icons
const InfiniteScrollRow: React.FC<{
  items: React.ReactNode[];
  reverse?: boolean;
  duration?: number;
  keyPrefix: string;
}> = ({ items, reverse = false, duration = 600, keyPrefix }) => (
  <motion.div
    className="flex"
    initial={{ x: reverse ? "-100%" : "0%" }}
    animate={{ x: reverse ? "0%" : "-100%" }}
    transition={{
      repeat: Infinity,
      duration,
      ease: "linear",
    }}
  >
    {[...items, ...items].map((item, index) => (
      <div key={`${keyPrefix}-${index}`} className="flex-shrink-0 px-6 py-5">
        {item}
      </div>
    ))}
  </motion.div>
);

const TrustedBy: React.FC = () => {
  const renderedLogos = logos.map((logo: string, i) => (
    <div
      key={`logo-${i}`}
      className="w-20 h-20 flex items-center justify-center bg-white dark:!bg-[#fff] rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <Image alt="logo" src={logo} width={55} height={55} />
    </div>
  ));
  const renderedLogos2 = logos2.map((logo: string, i) => (
    <div
      key={`logo-${i}`}
      className="w-20 h-20 flex items-center justify-center bg-white dark:!bg-[#fff] rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <Image alt="logo" src={logo} width={55} height={55} />
    </div>
  ));
  const renderedLogos3 = logos3.map((logo: string, i) => (
    <div
      key={`logo-${i}`}
      className="w-20 h-20 flex items-center justify-center bg-white dark:!bg-[#fff] rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <Image alt="logo" src={logo} width={55} height={55} />
    </div>
  ));

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          Trusted by notable organizations
        </h2>

        <div className="space-y-6">
          <div className="overflow-hidden">
            <InfiniteScrollRow
              items={renderedLogos}
              reverse={false}
              duration={1200}
              keyPrefix="row1"
            />
          </div>
          <div className="overflow-hidden">
            <InfiniteScrollRow
              items={renderedLogos2}
              reverse={true}
              duration={1000}
              keyPrefix="row2"
            />
          </div>
          <div className="overflow-hidden">
            <InfiniteScrollRow
              items={renderedLogos3}
              reverse={false}
              duration={1400}
              keyPrefix="row3"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            Join over 200+ organizations that trust our platform for their
            regulatory compliance needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
