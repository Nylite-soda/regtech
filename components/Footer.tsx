"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

const locations = [
  "Nigeria Companies",
  "South Africa Companies",
  "Cameroon Companies",
  "Kenya Companies",
  "Uganda Companies",
  "Egypt Companies",
];
const categories = ["AML", "SupTech", "Compliance", "Regulatory"];
const resourceLinks = [
  {
    text: "Pricing",
    href: "/checkout"
  },
  {
    text: "Privacy Policy",
    href: "/privacy"
  },
  {
    text: "Terms and Conditions",
    href: "/terms"
  },
  {
    text: "Regtech news",
    href: "https://regtechafrica.com/"
  },
  {
    text: "Events",
    href: "/events"
  },
  {
    text: "Place an ad",
    href: "/advertise"
  },
];

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
      router.push("/auth/company/register");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <footer className="w-full bg-[#111111] flex flex-col items-start gap-5 mx-auto pt-10 px-6 md:px-10">
      <Separator className="w-full h-1 bg-white/20 mb-5" />
      <div className="flex items-start justify-between w-full flex-wrap lg:flex-nowrap">
        {/* Brand Section */}
        <div className="flex flex-col w-full md:min-w-[500px] md:w-[40%] items-start pb-10 gap-5">
          <div className="flex flex-col items-start gap-3.5 w-full">
            <h2 className="[font-family:'Satoshi-Bold',Helvetica] font-bold text-[#ad0000] text-3xl md:text-4xl tracking-[0] leading-8 md:leading-9">
              Regtech Horizon
            </h2>
            <p className="w-full [font-family:'Satoshi-Regular',Helvetica] font-normal text-white text-lg md:text-xl tracking-[0] leading-6 md:leading-[30px]">
              Discover Africa's Leading RegTech Companies
            </p>
          </div>

          <Button 
            onClick={handleCompanyCreation}
            className="bg-white rounded-xl text-[#080808] hover:text-white hover:border hover:border-white"
            suppressHydrationWarning
          >
            <span className="[font-family:'Satoshi-Bold',Helvetica] font-bold text-base">
              {companyData ? "Create Company" : "Sign Up to Create Company"}
            </span>
          </Button>
        </div>

        {/* Footer Links */}
        <div className="flex items-start gap-10 md:gap-0 w-full md:justify-between flex-wrap md:flex-nowrap">
          {/* Locations */}
          <div className="flex flex-col w-full md:w-[30%] items-start gap-4">
            <h3 className="footer-link-header">
              Locations
            </h3>
            {locations.map((link, index) => (
              <a
                key={index}
                href="#"
                className="footer-link"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Company Links */}
          <div className="flex flex-col w-full md:w-[30%] items-start gap-4">
            <h3 className="footer-link-header">
              Niches
            </h3>
            {categories.map((link, index) => (
              <a
                key={index}
                href="#"
                className="footer-link"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Resource Links */}
          <div className="flex flex-col w-full md:w-[30%] items-start gap-4">
            <h3 className="footer-link-header">
              Resources
            </h3>
            <div className="flex flex-col items-start gap-3">
              {resourceLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className="footer-link"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex flex-col items-start gap-2 pt-5 w-full">
        <Separator className="w-full h-1 bg-white/20" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-5">
          <div className="flex min-w-[70px] w-[20%] h-full items-center gap-2">
            <img
              className="w-[16.43px] h-[15px]"
              alt="Social media icon"
              src="/images/group.png"
            />
            <img
              className="w-[15px] h-[15px]"
              alt="Social media icon"
              src="/images/vector.svg"
            />
            <img
              className="w-[15.09px] h-[15px]"
              alt="Social media icon"
              src="/images/g12.png"
            />
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-10 md:gap-5 w-full text-white">
            <p className="[font-family:'Satoshi-Bold',Helvetica] font-semibold text-base md:text-lg tracking-[0] leading-5">
              © Regtech Horizon 2025. All rights reserved
            </p>
            <span className="hidden md:block">•</span>
            <a
              href="#"
              className="[font-family:'Satoshi-Bold',Helvetica] font-semibold text-base md:text-lg tracking-[0] leading-5"
            >
              Terms of Service
            </a>
            <span className="hidden md:block">•</span>
            <a
              href="#"
              className="[font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-base md:text-lg tracking-[0] leading-5"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
