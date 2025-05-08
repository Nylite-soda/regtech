"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Landmark,
  Shield,
  Building,
  BadgeCheck,
  Award,
  Briefcase,
  Globe,
  BarChart3,
  Book,
  Camera,
  Car,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Key,
  Laptop,
  Mail,
  Map,
  Monitor,
  Music,
  Paperclip,
  PenTool,
  Phone,
  Printer,
  Radio,
  Server,
  Smartphone,
  LucideIcon,
} from "lucide-react";

// Define logo and color pair
interface LogoItem {
  icon: LucideIcon;
  color: string;
}

// Build icon list with color mapping
const logoItems: LogoItem[] = [
  Building2,
  Shield,
  Landmark,
  Building,
  BadgeCheck,
  Award,
  Briefcase,
  Globe,
  BarChart3,
  Book,
  Camera,
  Car,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Key,
  Laptop,
  Mail,
  Map,
  Monitor,
  Music,
  Paperclip,
  PenTool,
  Phone,
  Printer,
  Radio,
  Server,
  Smartphone,
].map((icon, i) => ({
  icon,
  color: [
    "#006E51",
    "#1A365D",
    "#7C3AED",
    "#2563EB",
    "#AD0000",
    "#0891B2",
    "#7E22CE",
    "#047857",
    "#B91C1C",
    "#4338CA",
    "#EA580C",
    "#0369A1",
    "#CA8A04",
    "#9333EA",
    "#15803D",
    "#DC2626",
    "#4F46E5",
    "#0D9488",
    "#BE123C",
    "#6D28D9",
    "#65A30D",
    "#0284C7",
    "#D97706",
    "#7C2D12",
    "#475569",
    "#0F766E",
    "#86198F",
    "#166534",
    "#2563EB",
  ][i % 29], // Safe fallback with mod
}));

// Render one scrolling row of icons
const InfiniteScrollRow: React.FC<{
  items: React.ReactNode[];
  reverse?: boolean;
  duration?: number;
  keyPrefix: string;
}> = ({ items, reverse = false, duration = 60, keyPrefix }) => (
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
  const renderedIcons = logoItems.map(({ icon: Icon, color }, i) => (
    <div
      key={`icon-${i}`}
      className="w-20 h-20 flex items-center justify-center bg-white rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <Icon size={38} style={{ color }} />
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
              items={renderedIcons}
              reverse={false}
              duration={60}
              keyPrefix="row1"
            />
          </div>
          <div className="overflow-hidden">
            <InfiniteScrollRow
              items={renderedIcons}
              reverse={true}
              duration={50}
              keyPrefix="row2"
            />
          </div>
          <div className="overflow-hidden">
            <InfiniteScrollRow
              items={renderedIcons}
              reverse={false}
              duration={70}
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
