import React from 'react';
import { Building2, Landmark, Shield, Building, BadgeCheck } from 'lucide-react';

const partners = [
  {
    name: "Central Bank of Nigeria",
    logo: Building2,
    description: "Financial Regulator",
    color: "#006E51"
  },
  {
    name: "Securities Commission",
    logo: Shield,
    description: "Market Regulator",
    color: "#1A365D"
  },
  {
    name: "African Development Bank",
    logo: Landmark,
    description: "Development Finance",
    color: "#7C3AED"
  },
  {
    name: "Standard Chartered",
    logo: Building,
    description: "Global Banking",
    color: "#2563EB"
  },
  {
    name: "Nigerian Stock Exchange",
    logo: BadgeCheck,
    description: "Securities Exchange",
    color: "#AD0000"
  }
];

const TrustedBy = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-[#AD0000] text-2xl text-center md:text-4xl font-bold mb-16">
          Trusted by notable organizations worldwide
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {partners.map((partner, index) => {
            const Icon = partner.logo;
            return (
              <div 
                key={partner.name}
                className="group flex flex-col items-center justify-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div 
                  className="w-16 h-16 mb-4 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-opacity-80 transition-colors duration-300"
                  style={{ backgroundColor: `${partner.color}10` }}
                >
                  <Icon 
                    size={32} 
                    className="transition-colors duration-300"
                    style={{ color: partner.color }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">
                  {partner.name}
                </h3>
                <p className="text-xs text-gray-500 text-center">
                  {partner.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            Join over 200+ organizations that trust RegTech Africa for their regulatory compliance needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;