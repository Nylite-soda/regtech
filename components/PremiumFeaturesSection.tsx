import React from "react";
import { ArrowRight, Shield, LineChart, Bell, Zap } from "lucide-react";
import { Button } from "./ui/button";

const features = [
  {
    icon: Shield,
    title: "Advanced Compliance Tools",
    description:
      "Real-time monitoring and automated compliance checks across multiple jurisdictions",
  },
  {
    icon: LineChart,
    title: "Market Intelligence",
    description:
      "Deep insights into regulatory trends with predictive analytics and market analysis",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description:
      "Stay informed with real-time notifications on regulatory changes and updates",
  },
  {
    icon: Zap,
    title: "Smart Automation",
    description:
      "Streamline your compliance workflow with AI-powered automation tools",
  },
];

const PremiumFeatures = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-[#AD0000]/90 py-20 px-4 md:px-6 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <span className="inline-block w-2 h-2 bg-[#AD0000] rounded-full animate-pulse"></span>
                  <span className="text-white/90 text-sm font-medium">
                    Premium Access
                  </span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Transform Your Regulatory Compliance with Premium Features
              </h2>
              <p className="text-gray-300 text-lg">
                Get exclusive access to advanced tools, real-time insights, and
                expert analysis to stay ahead in the evolving regulatory
                landscape.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#AD0000]/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#AD0000]/10 flex items-center justify-center mb-4 group-hover:bg-[#AD0000]/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#AD0000]" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* 
            <Button 
              className="bg-[#AD0000] text-white px-8 py-3 rounded-lg hover:bg-[#AD0000]/90 transition-colors duration-300 flex items-center gap-2 group"
            >
              Get Premium Access
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button> */}
          </div>

          <div className="relative lg:h-[600px] h-[400px] rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="RegTech Dashboard"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures;
