import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLinksProps {
  locations: string[];
  categories: string[];
  resourceLinks: {
    text: string;
    href: string;
  }[];
}

const FooterLinks = ({
  locations,
  categories,
  resourceLinks,
}: FooterLinksProps) => {
  return (
    <div className="flex items-start max-w-[850px] gap-10 md:gap-8 w-full md:justify-between flex-wrap md:flex-nowrap">
      {/* Locations */}
      <FooterLinkSection
        title="Locations"
        links={locations.map((text) => ({
          text,
          href: `/companies?country=${text}`,
        }))}
        animationDelay="delay-100"
      />

      {/* Niches */}
      <FooterLinkSection
        title="Niches"
        links={categories.map((text) => ({
          text,
          href: `/companies?niche=${text}`,
        }))}
        animationDelay="delay-200"
      />

      {/* Resources */}
      <FooterLinkSection
        title="Resources"
        links={resourceLinks}
        animationDelay="delay-300"
      />
    </div>
  );
};

interface FooterLinkSectionProps {
  title: string;
  links: {
    text: string;
    href: string;
  }[];
  animationDelay?: string;
}

const FooterLinkSection = ({
  title,
  links,
  animationDelay,
}: FooterLinkSectionProps) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full md:w-[30%] items-start gap-5",
        "animate-in slide-in-from-bottom duration-500",
        animationDelay
      )}
    >
      <h3
        className={cn(
          "font-semibold text-gray-900 dark:text-white text-lg",
          "transition-colors duration-300"
        )}
      >
        {title}
      </h3>
      <div className="flex flex-col items-start gap-4 w-full">
        {links.map((link, index) => (
          <Link
            key={`${link.text}-${index}`}
            href={link.href}
            className={cn(
              "text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-500",
              "font-medium text-base relative transition-colors duration-200 group",
              "flex items-center"
            )}
          >
            <span className="inline-block mb-1">{link.text}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 dark:bg-red-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterLinks;
