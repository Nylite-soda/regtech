"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterBottom from "./FooterBottom";
import { storeRedirectUrl } from "@/lib/utils";

const footerData = {
  locations: [
    "Nigeria",
    "South Africa",
    "Cameroon",
    "Kenya",
    "Uganda",
    "Egypt",
  ],

  categories: ["AML", "SupTech", "Compliance", "Regulatory"],

  resourceLinks: [
    // {
    //   text: "Pricing",
    //   href: "/checkout",
    // },
    {
      text: "Privacy Policy",
      href: "/privacy",
    },
    {
      text: "Terms and Conditions",
      href: "/terms",
    },
    {
      text: "Regtech news",
      href: "https://regtechafrica.com/",
    },
    // {
    //   text: "Events",
    //   href: "/events",
    // },
    // {
    //   text: "Place an ad",
    //   href: "/advertise",
    // },
  ],
};

const Footer = () => {
  const router = useRouter();
  const [companyData, setCompanyData] = useState("");

  useEffect(() => {
    const storedCompany = localStorage.getItem("access_token");
    if (storedCompany) {
      try {
        setCompanyData(storedCompany);
      } catch (error) {
        console.error("Error parsing company data:", error);
      }
    }
  }, []);

  const handleCompanyCreation = () => {
    if (companyData) {
      storeRedirectUrl();
      router.push("/auth/company/register");
    } else {
      storeRedirectUrl();
      router.push("/auth/signin");
    }
  };

  return (
    <footer className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black transition-colors duration-300 ease-in-out flex flex-col items-start gap-5 mx-auto pt-10 px-6 md:px-10 overflow-hidden border-t border-gray-200 dark:border-gray-800">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-900 to-transparent mb-5" />

      <div className="flex items-start justify-between w-full flex-wrap lg:flex-nowrap gap-10">
        {/* Brand Section */}
        <FooterBrand
          companyData={companyData}
          handleCompanyCreation={handleCompanyCreation}
        />

        {/* Footer Links */}
        <FooterLinks
          locations={footerData.locations}
          categories={footerData.categories}
          resourceLinks={footerData.resourceLinks}
        />
      </div>

      {/* Footer Bottom */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
