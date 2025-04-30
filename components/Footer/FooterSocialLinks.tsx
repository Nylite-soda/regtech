import React from "react";
import { Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import Twitter from "../ui/Twitter";

const FooterSocialLinks = () => {
  const socialIcons = [
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      href: "#"
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-4 h-4" />,
      href: "#"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-4 h-4" />,
      href: "#"
    }
  ];

  return (
    <div className="flex items-center gap-5">
      {socialIcons.map((social) => (
        <a
          key={social.name}
          href={social.href}
          aria-label={`Follow us on ${social.name}`}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
            "hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-white",
            "transform hover:scale-110 transition-all duration-300"
          )}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default FooterSocialLinks;