"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent } from "./ui/card";
import africaData from "@/public/africa.json";

const THEME = {
  primary: "#AD0000",
  secondary: "#1E1E1E",
  accent: "#2D2D2D",
  text: {
    primary: "#FFFFFF",
    secondary: "#E7E7E7",
    muted: "#A0A0A0"
  },
  stats: {
    all: "#E7E7E7"  // Using a single color for all stats
  },
  border: "#363636"
} as const;

type CountryStats = {
  totalCompanies: number;
  activeUsers: string;
  totalRevenue: string;
  growthRate: string;
};

type CountryDataType = Record<string, {
  region: string;
  stats: CountryStats;
}>;

// Mock data generator for consistent values
const generateMockStats = (
  baseCompanies: number,
  baseUsers: number,
  baseRevenue: number,
  baseGrowth: number
): CountryStats => ({
  totalCompanies: Math.floor(baseCompanies * (0.8 + Math.random() * 0.4)),
  activeUsers: (baseUsers * (0.8 + Math.random() * 0.4)).toFixed(1) + "K",
  totalRevenue: "$" + (baseRevenue * (0.8 + Math.random() * 0.4)).toFixed(1) + "M",
  growthRate: "+" + (baseGrowth * (0.8 + Math.random() * 0.4)).toFixed(1) + "%"
});

// Generate mock data for all countries
const countryData: CountryDataType = {
  // North Africa
  "Algeria": { region: "North Africa", stats: generateMockStats(50, 2.5, 85, 12) },
  "Egypt": { region: "North Africa", stats: generateMockStats(80, 3.8, 140, 14) },
  "Libya": { region: "North Africa", stats: generateMockStats(30, 1.5, 45, 8) },
  "Mauritania": { region: "North Africa", stats: generateMockStats(12, 0.6, 14, 5) },
  "Morocco": { region: "North Africa", stats: generateMockStats(65, 3.2, 110, 13) },
  "Sudan": { region: "North Africa", stats: generateMockStats(35, 1.8, 50, 9) },
  "Tunisia": { region: "North Africa", stats: generateMockStats(45, 2.2, 75, 11) },
  "Western Sahara": { region: "North Africa", stats: generateMockStats(5, 0.3, 6, 2) },

  // West Africa
  "Benin": { region: "West Africa", stats: generateMockStats(15, 0.8, 18, 6) },
  "Burkina Faso": { region: "West Africa", stats: generateMockStats(20, 1.0, 25, 8) },
  "Cape Verde": { region: "West Africa", stats: generateMockStats(8, 0.4, 10, 4) },
  "Côte d'Ivoire": { region: "West Africa", stats: generateMockStats(35, 1.8, 45, 11) },
  "Gambia": { region: "West Africa", stats: generateMockStats(10, 0.5, 12, 4) },
  "Ghana": { region: "West Africa", stats: generateMockStats(45, 2.1, 60, 12) },
  "Guinea": { region: "West Africa", stats: generateMockStats(16, 0.8, 18, 6) },
  "Guinea-Bissau": { region: "West Africa", stats: generateMockStats(9, 0.5, 11, 4) },
  "Liberia": { region: "West Africa", stats: generateMockStats(15, 0.8, 20, 6) },
  "Mali": { region: "West Africa", stats: generateMockStats(25, 1.2, 30, 9) },
  "Niger": { region: "West Africa", stats: generateMockStats(18, 0.9, 22, 7) },
  "Nigeria": { region: "West Africa", stats: generateMockStats(90, 4.2, 120, 15) },
  "Senegal": { region: "West Africa", stats: generateMockStats(30, 1.5, 40, 10) },
  "Sierra Leone": { region: "West Africa", stats: generateMockStats(12, 0.6, 15, 5) },
  "Togo": { region: "West Africa", stats: generateMockStats(14, 0.7, 16, 5) },

  // Central Africa
  "Angola": { region: "Central Africa", stats: generateMockStats(38, 1.9, 52, 10) },
  "Cameroon": { region: "Central Africa", stats: generateMockStats(40, 2.0, 55, 11) },
  "Central African Republic": { region: "Central Africa", stats: generateMockStats(15, 0.8, 20, 6) },
  "Chad": { region: "Central Africa", stats: generateMockStats(20, 1.0, 25, 7) },
  "Republic of the Congo": { region: "Central Africa", stats: generateMockStats(30, 1.5, 40, 9) },
  "Democratic Republic of the Congo": { region: "Central Africa", stats: generateMockStats(45, 2.2, 65, 10) },
  "Equatorial Guinea": { region: "Central Africa", stats: generateMockStats(18, 0.9, 25, 7) },
  "Gabon": { region: "Central Africa", stats: generateMockStats(25, 1.2, 35, 8) },
  "São Tomé and Príncipe": { region: "Central Africa", stats: generateMockStats(6, 0.3, 8, 3) },

  // East Africa
  "Burundi": { region: "East Africa", stats: generateMockStats(14, 0.7, 16, 5) },
  "Comoros": { region: "East Africa", stats: generateMockStats(7, 0.3, 8, 3) },
  "Djibouti": { region: "East Africa", stats: generateMockStats(10, 0.5, 12, 4) },
  "Eritrea": { region: "East Africa", stats: generateMockStats(12, 0.6, 15, 4) },
  "Ethiopia": { region: "East Africa", stats: generateMockStats(55, 2.8, 75, 14) },
  "Kenya": { region: "East Africa", stats: generateMockStats(70, 3.1, 95, 13) },
  "Madagascar": { region: "East Africa", stats: generateMockStats(28, 1.4, 35, 8) },
  "Malawi": { region: "East Africa", stats: generateMockStats(22, 1.1, 28, 7) },
  "Mauritius": { region: "East Africa", stats: generateMockStats(15, 0.8, 20, 6) },
  "Mozambique": { region: "East Africa", stats: generateMockStats(35, 1.7, 45, 10) },
  "Rwanda": { region: "East Africa", stats: generateMockStats(35, 1.7, 45, 12) },
  "Seychelles": { region: "East Africa", stats: generateMockStats(8, 0.4, 10, 3) },
  "Somalia": { region: "East Africa", stats: generateMockStats(15, 0.8, 20, 5) },
  "South Sudan": { region: "East Africa", stats: generateMockStats(20, 1.0, 25, 6) },
  "Tanzania": { region: "East Africa", stats: generateMockStats(50, 2.5, 70, 11) },
  "Uganda": { region: "East Africa", stats: generateMockStats(40, 2.0, 55, 10) },
  "Zambia": { region: "East Africa", stats: generateMockStats(32, 1.6, 42, 9) },
  "Zimbabwe": { region: "East Africa", stats: generateMockStats(30, 1.5, 40, 9) },

  // Southern Africa
  "Botswana": { region: "Southern Africa", stats: generateMockStats(40, 2.0, 60, 11) },
  "Eswatini": { region: "Southern Africa", stats: generateMockStats(15, 0.8, 20, 6) },
  "Lesotho": { region: "Southern Africa", stats: generateMockStats(12, 0.6, 15, 5) },
  "Namibia": { region: "Southern Africa", stats: generateMockStats(25, 1.2, 35, 8) },
  "South Africa": { region: "Southern Africa", stats: generateMockStats(110, 5.5, 180, 18) }
};

// Update the country name mapping to include more variations
const countryNameMapping: Record<string, string> = {
  "Côte d'Ivoire": "Ivory Coast",
  "Ivory Coast": "Côte d'Ivoire",
  "Democratic Republic of the Congo": "DR Congo",
  "DR Congo": "Democratic Republic of the Congo",
  "DEM. REP. CONGO": "Democratic Republic of the Congo",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  "Republic of the Congo": "Congo",
  "Congo": "Republic of the Congo",
  "Eswatini": "Swaziland",
  "Swaziland": "Eswatini",
  "Cape Verde": "Cabo Verde",
  "Cabo Verde": "Cape Verde",
  "São Tomé and Príncipe": "Sao Tome and Principe",
  "Sao Tome and Principe": "São Tomé and Príncipe",
  "Western Sahara": "Sahrawi Arab Democratic Republic",
  "Sahrawi Arab Democratic Republic": "Western Sahara",
  "Central African Republic": "CAR",
  "CAR": "Central African Republic",
  "Equatorial Guinea": "Guinea Ecuatorial",
  "Guinea Ecuatorial": "Equatorial Guinea",
  "Eq. Guinea": "Equatorial Guinea",
  "Democratic Republic of Congo": "Democratic Republic of the Congo",
  "DRC": "Democratic Republic of the Congo",
  "Congo, Democratic Republic of the": "Democratic Republic of the Congo",
  "Congo, Republic of the": "Republic of the Congo",
  "Congo-Brazzaville": "Republic of the Congo",
  "Congo-Kinshasa": "Democratic Republic of the Congo",
  // Add exact matches for Guinea variations
  "Republic of Guinea": "Guinea",
  "Guinea-Conakry": "Guinea"
};

// Memoized helper functions
const parseNumericValue = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
};

const formatValue = (key: keyof CountryStats, value: number): string => {
  switch (key) {
    case 'totalCompanies':
      return Math.round(value).toString();
    case 'activeUsers':
      return value.toFixed(1) + "K";
    case 'totalRevenue':
      return "$" + value.toFixed(1) + "M";
    case 'growthRate':
      return "+" + value.toFixed(1) + "%";
    default:
      return value.toString();
  }
};

const calculateRegionStats = (countries: string[]): CountryStats => {
  const validCountries = countries.filter(country => countryData[country]);
  if (!validCountries.length) return generateMockStats(0, 0, 0, 0);

  const totals = validCountries.reduce((acc, country) => {
    const stats = countryData[country].stats;
    return {
      totalCompanies: acc.totalCompanies + stats.totalCompanies,
      activeUsers: acc.activeUsers + parseNumericValue(stats.activeUsers),
      totalRevenue: acc.totalRevenue + parseNumericValue(stats.totalRevenue),
      growthRate: acc.growthRate + parseNumericValue(stats.growthRate)
    };
  }, {
    totalCompanies: 0,
    activeUsers: 0,
    totalRevenue: 0,
    growthRate: 0
  });

  // Average the growth rate
  totals.growthRate /= validCountries.length;

  return {
    totalCompanies: totals.totalCompanies,
    activeUsers: formatValue('activeUsers', totals.activeUsers),
    totalRevenue: formatValue('totalRevenue', totals.totalRevenue),
    growthRate: formatValue('growthRate', totals.growthRate)
  };
};

const regions = {
  "North Africa": {
    countries: [
      "Algeria",
      "Egypt",
      "Libya",
      "Mauritania",
      "Morocco",
      "Sudan",
      "Tunisia",
      "Western Sahara"
    ],
    stats: calculateRegionStats([
      "Algeria",
      "Egypt",
      "Libya",
      "Mauritania",
      "Morocco",
      "Sudan",
      "Tunisia",
      "Western Sahara"
    ])
  },
  "West Africa": {
    countries: [
      "Benin",
      "Burkina Faso",
      "Cape Verde",
      "Côte d'Ivoire",
      "Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Liberia",
      "Mali",
      "Niger",
      "Nigeria",
      "Senegal",
      "Sierra Leone",
      "Togo"
    ],
    stats: calculateRegionStats([
      "Benin",
      "Burkina Faso",
      "Cape Verde",
      "Côte d'Ivoire",
      "Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Liberia",
      "Mali",
      "Niger",
      "Nigeria",
      "Senegal",
      "Sierra Leone",
      "Togo"
    ])
  },
  "Central Africa": {
    countries: [
      "Angola",
      "Cameroon",
      "Central African Republic",
      "Chad",
      "Republic of the Congo",
      "Democratic Republic of the Congo",
      "Equatorial Guinea",
      "Gabon",
      "São Tomé and Príncipe"
    ],
    stats: calculateRegionStats([
      "Angola",
      "Cameroon",
      "Central African Republic",
      "Chad",
      "Republic of the Congo",
      "Democratic Republic of the Congo",
      "Equatorial Guinea",
      "Gabon",
      "São Tomé and Príncipe"
    ])
  },
  "East Africa": {
    countries: [
      "Burundi",
      "Comoros",
      "Djibouti",
      "Eritrea",
      "Ethiopia",
      "Kenya",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Mozambique",
      "Rwanda",
      "Seychelles",
      "Somalia",
      "South Sudan",
      "Tanzania",
      "Uganda",
      "Zambia",
      "Zimbabwe"
    ],
    stats: calculateRegionStats([
      "Burundi",
      "Comoros",
      "Djibouti",
      "Eritrea",
      "Ethiopia",
      "Kenya",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Mozambique",
      "Rwanda",
      "Seychelles",
      "Somalia",
      "South Sudan",
      "Tanzania",
      "Uganda",
      "Zambia",
      "Zimbabwe"
    ])
  },
  "Southern Africa": {
    countries: [
      "Botswana",
      "Eswatini",
      "Lesotho",
      "Namibia",
      "South Africa"
    ],
    stats: calculateRegionStats([
      "Botswana",
      "Eswatini",
      "Lesotho",
      "Namibia",
      "South Africa"
    ])
  }
};

export const AfricaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getCountryColor = (geo: any) => {
    const countryName = geo.properties.name;
    
    // Normalize the country name by removing extra spaces and converting to lowercase
    const normalizedGeoName = countryName.trim().toLowerCase();
    
    // Special handling for Guinea vs Equatorial Guinea
    if (normalizedGeoName.includes('guinea')) {
      if (normalizedGeoName.includes('equatorial') || normalizedGeoName === 'eq. guinea') {
        return handleCountryMatch("Equatorial Guinea");
      } else if (normalizedGeoName.includes('bissau')) {
        return handleCountryMatch("Guinea-Bissau");
      } else if (normalizedGeoName === 'guinea') {
        return handleCountryMatch("Guinea");
      }
    }
    
    // First try exact match (case-insensitive)
    const exactMatch = Object.keys(countryData).find(name => 
      name.toLowerCase() === normalizedGeoName
    );
    
    if (exactMatch) {
      return handleCountryMatch(exactMatch);
    }

    // Try matching with the name mapping
    const mappedName = countryNameMapping[countryName];
    if (mappedName && countryData[mappedName]) {
      return handleCountryMatch(mappedName);
    }

    // Try strict partial match only for non-Guinea countries
    if (!normalizedGeoName.includes('guinea')) {
      const partialMatch = Object.keys(countryData).find(name => {
        const normalizedName = name.toLowerCase();
        // Only match if the geo name contains all words from the country name in sequence
        return normalizedName.split(/\s+/).every((word, index, words) => {
          const position = normalizedGeoName.indexOf(word);
          if (position === -1) return false;
          
          // For multi-word country names, ensure words appear in sequence
          if (index > 0) {
            const prevWord = words[index - 1];
            const prevPosition = normalizedGeoName.indexOf(prevWord);
            return prevPosition < position;
          }
          return true;
        });
      });

      if (partialMatch) {
        return handleCountryMatch(partialMatch);
      }
    }

    return "#ffffff"; // Default color for unmatched countries
  };

  // Helper function to handle country color based on selection
  const handleCountryMatch = (matchedCountry: string) => {
    if (matchedCountry === selectedCountry) {
      return "#AD0000";
    }
    if (selectedRegion) {
      const isInSelectedRegion = regions[selectedRegion as keyof typeof regions].countries.includes(matchedCountry);
      return isInSelectedRegion ? "#363636" : "#ffffff";
    }
    return "#ffffff";
  };

  const getSelectedStats = useCallback(() => {
    if (selectedCountry && countryData[selectedCountry]) {
      const countryInfo = countryData[selectedCountry];
      return {
        title: selectedCountry,
        subtitle: countryInfo.region,
        data: countryInfo.stats
      };
    }

    if (selectedRegion) {
      const regionCountries = regions[selectedRegion as keyof typeof regions].countries;
      return {
        title: selectedRegion,
        subtitle: "Region",
        data: calculateRegionStats(regionCountries)
      };
    }

    return {
      title: "Overall",
      subtitle: "All Regions",
      data: calculateRegionStats(Object.keys(countryData))
    };
  }, [selectedCountry, selectedRegion]);

  const stats = useMemo(() => getSelectedStats(), [getSelectedStats]);

  return (
    <div className="bg-[#080808] min-h-screen">
      <div className="max-w-[1440px] mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold">
              African RegTech Landscape
            </h1>
            <p className="text-[#A0A0A0] mt-2">
              Explore regulatory technology companies across Africa
            </p>
          </div>
          {(selectedRegion || selectedCountry) && (
            <button
              onClick={() => {
                setSelectedRegion(null);
                setSelectedCountry(null);
              }}
              className="flex items-center gap-2 text-[#E7E7E7] hover:text-white text-sm bg-[#1E1E1E] px-4 py-2 rounded-md transition-all hover:bg-[#2D2D2D] border border-[#363636] hover:border-[#AD0000]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Reset View
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[400px] flex flex-col gap-6">
            <Card className="bg-[#1E1E1E] border-[#363636] transition-all duration-300 hover:border-[#AD0000] shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-bold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#AD0000]" />
                      {stats.title}
                    </h3>
                    <div className="text-[#A0A0A0] text-sm">
                      {stats.subtitle}
                    </div>
                  </div>
                  
                  <div className="bg-[#2D2D2D] p-5 rounded-lg grid grid-cols-2 gap-5">
                    {Object.entries(stats.data).map(([key, value]) => (
                      <div 
                        key={key}
                        className="transition-all duration-300 hover:scale-105 p-4 rounded-lg bg-[#1E1E1E] border border-[#363636] hover:border-[#AD0000]"
                      >
                        <p className="text-[#A0A0A0] text-sm mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#AD0000]" />
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-[#E7E7E7] text-xl font-bold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#AD0000]" />
                    Regions
                  </h3>
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="text-white space-y-2"
                  >
                    {Object.entries(regions).map(([region, data]) => (
                      <AccordionItem 
                        value={region} 
                        key={region}
                        className="border border-transparent transition-all duration-300 hover:border-[#363636] rounded-md overflow-hidden"
                      >
                        <AccordionTrigger
                          className={`
                            hover:bg-[#1a1a1a] px-4 py-2 rounded-md transition-all duration-300
                            ${selectedRegion === region ? 'bg-[#1a1a1a] text-[#AD0000]' : ''}
                          `}
                          onClick={() => {
                            setSelectedRegion(region);
                            setSelectedCountry(null);
                          }}
                          onMouseEnter={() => setHoveredRegion(region)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedRegion === region ? 'bg-[#AD0000]' : 'bg-[#363636]'
                            }`} />
                            {region}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar px-2">
                            {data.countries.map((country) => (
                              <button
                                key={country}
                                className={`
                                  block w-full text-left px-4 py-2 rounded-md 
                                  transition-all duration-300
                                  hover:bg-[#1a1a1a] hover:translate-x-1
                                  ${
                                    selectedCountry === country
                                      ? 'bg-[#1a1a1a] text-[#AD0000] translate-x-1'
                                      : ''
                                  }
                                `}
                                onClick={() => setSelectedCountry(country)}
                              >
                                {country}
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <Card className={`
              bg-[${THEME.secondary}] border-[${THEME.border}]
              transition-all duration-300 hover:border-[${THEME.primary}]
              shadow-lg h-full
            `}>
              <CardContent className="p-6">
                <style jsx global>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1a1a1a;
                    border-radius: 2px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #363636;
                    border-radius: 2px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #AD0000;
                  }
                `}</style>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 420,
                    center: [15, 0],
                  }}
                  width={800}
                  height={600}
                  className="transition-all duration-300"
                >
                  <Geographies geography={africaData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isHovered = hoveredRegion && 
                          regions[hoveredRegion as keyof typeof regions]?.countries.includes(geo.properties.name);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => {
                              const countryName = geo.properties.name;
                              console.log("Clicked country:", countryName);
                              
                              const normalizedGeoName = countryName.toLowerCase().trim();
                              let matchedCountry = null;
                              
                              // Special handling for Guinea variations
                              if (normalizedGeoName.includes('guinea')) {
                                if (normalizedGeoName.includes('equatorial') || normalizedGeoName === 'eq. guinea') {
                                  matchedCountry = "Equatorial Guinea";
                                } else if (normalizedGeoName.includes('bissau')) {
                                  matchedCountry = "Guinea-Bissau";
                                } else if (normalizedGeoName === 'guinea') {
                                  matchedCountry = "Guinea";
                                }
                              } else {
                                // Try exact match first
                                const exactMatch = Object.keys(countryData).find(name => 
                                  name.toLowerCase() === normalizedGeoName
                                );
                                
                                // Try name mapping
                                const mappedName = countryNameMapping[countryName];
                                
                                // Try strict partial match for non-Guinea countries
                                const partialMatch = !normalizedGeoName.includes('guinea') ? 
                                  Object.keys(countryData).find(name => {
                                    const normalizedName = name.toLowerCase();
                                    // Only match if the geo name contains all words from the country name in sequence
                                    return normalizedName.split(/\s+/).every((word, index, words) => {
                                      const position = normalizedGeoName.indexOf(word);
                                      if (position === -1) return false;
                                      
                                      // For multi-word country names, ensure words appear in sequence
                                      if (index > 0) {
                                        const prevWord = words[index - 1];
                                        const prevPosition = normalizedGeoName.indexOf(prevWord);
                                        return prevPosition < position;
                                      }
                                      return true;
                                    });
                                  }) : null;
                                
                                matchedCountry = exactMatch || 
                                                (mappedName && countryData[mappedName] ? mappedName : null) || 
                                                partialMatch;
                              }
                              
                              console.log("Matched country:", matchedCountry);
                              
                              if (matchedCountry) {
                                setSelectedCountry(matchedCountry);
                                Object.entries(regions).forEach(([region, data]) => {
                                  if (data.countries.includes(matchedCountry)) {
                                    setSelectedRegion(region);
                                  }
                                });
                              }
                            }}
                            style={{
                              default: {
                                fill: isHovered ? '#363636' : getCountryColor(geo),
                                stroke: "#363636",
                                strokeWidth: 0.5,
                                outline: "none",
                                transition: 'all 0.3s',
                              },
                              hover: {
                                fill: "#AD0000",
                                stroke: "#363636",
                                strokeWidth: 0.5,
                                outline: "none",
                                transition: 'all 0.3s',
                              },
                              pressed: {
                                fill: "#AD0000",
                                stroke: "#363636",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
