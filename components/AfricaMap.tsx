"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent } from "./ui/card";
import africaData from "@/public/africa.json";

const regions = {
  "West Africa": {
    countries: [
      "Nigeria",
      "Ghana",
      "Senegal",
      "Ivory Coast",
      "Côte d'Ivoire",
      "Mali",
      "Burkina Faso",
      "Niger",
      "Liberia",
      "Sierra Leone",
      "Guinea",
      "Togo",
      "Benin",
      "Gambia",
      "Mauritania",
      "Cape Verde",
      "Guinea-Bissau",
    ],
    stats: {
      totalCompanies: 234,
      activeUsers: "12.5K",
      totalRevenue: "$284.3K",
    },
  },
  "East Africa": {
    countries: [
      "Kenya",
      "Tanzania",
      "Uganda",
      "Rwanda",
      "Ethiopia",
      "Somalia",
      "Djibouti",
      "Eritrea",
      "Seychelles",
      "Mauritius",
      "Comoros",
      "Burundi",
    ],
    stats: {
      totalCompanies: 156,
      activeUsers: "8.2K",
      totalRevenue: "$192.1K",
    },
  },
  "North Africa": {
    countries: [
      "Egypt",
      "Morocco",
      "Tunisia",
      "Algeria",
      "Libya",
      "Sudan",
      "S. Sudan",
      "Western Sahara",
      "W. Sahara",
    ],
    stats: {
      totalCompanies: 189,
      activeUsers: "10.1K",
      totalRevenue: "$225.7K",
    },
  },
  "Southern Africa": {
    countries: [
      "South Africa",
      "Botswana",
      "Zimbabwe",
      "Namibia",
      "Mozambique",
      "Zambia",
      "Angola",
      "Lesotho",
      "Eswatini (Swaziland)",
      "Eswatini",
      "eSwatini",
      "Malawi",
      "Seychelles",
      "Comoros",
    ],
    stats: {
      totalCompanies: 201,
      activeUsers: "11.3K",
      totalRevenue: "$246.4K",
    },
  },
  "Central Africa": {
    countries: [
      "Democratic Republic of the Congo",
      "Dem. Rep. Congo",
      "Republic of the Congo",
      "Congo",
      "Cameroon",
      "Gabon",
      "Equatorial Guinea",
      "Eq. Guinea",
      "Central African Republic",
      "Central African Rep.",
      "Chad",
      "Sao Tome and Principe",
    ],
    stats: {
      totalCompanies: 134,
      activeUsers: "7.4K",
      totalRevenue: "$170.9K",
    },
  },
};

export const AfricaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const getCountryColor = (geo: any) => {
    const countryName = geo.properties.name;
    if (countryName === selectedCountry) {
      return "#AD0000"; // Selected country color
    }

    if (selectedRegion) {
      const isInSelectedRegion = regions[
        selectedRegion as keyof typeof regions
      ].countries.includes(countryName.trim());
      return isInSelectedRegion ? "#363636" : "#ffffff";
    }

    return "#ffffff"; // Default color
  };

  return (
    <div className="bg-[#080808] mt-10">
      <div className="max-w-[1440px] mx-auto p-4 md:p-8">
        <h1 className="text-white text-2xl mt-5 md:text-3xl font-bold mb-6 text-center md:text-left">
          African RegTech Landscape
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 justify-around w-full">
          {/* Left side - Accordion */}
          <div className="md:col-span-4 w-full lg:min-w-[300px] min-w-[250px]">
            <Card className="bg-[#111111] border-[#363636] w-full">
              <CardContent className="p-4 md:p-6">
                <Accordion type="single" collapsible className="text-white">
                  {Object.entries(regions).map(([region, data]) => (
                    <AccordionItem value={region} key={region}>
                      <AccordionTrigger
                        onClick={() => {
                          setSelectedRegion(region);
                          setSelectedCountry(null);
                        }}
                      >
                        {region}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {data.countries.map((country) => (
                            <button
                              key={country}
                              className={`block w-full text-left px-4 py-2 rounded hover:bg-[#1a1a1a] transition ${
                                selectedCountry === country
                                  ? "bg-[#1a1a1a] text-[#AD0000]"
                                  : ""
                              }`}
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

                {/* Stats Section */}
                {(selectedRegion || selectedCountry) && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {selectedCountry || selectedRegion} Statistics
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {(selectedRegion &&
                        regions[selectedRegion as keyof typeof regions] && (
                          <div className="bg-[#1a1a1a] p-4 flex flex-col gap-2 rounded-lg">
                            {Object.entries(
                              regions[selectedRegion as keyof typeof regions]
                                .stats
                            ).map(([key, value]) => (
                              <div key={key}>
                                <p className="text-[#e7e7e7] text-sm">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <p className="text-white text-xl font-bold">
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )) ||
                        (selectedCountry &&
                          Object.entries(regions).map(([region, data]) => {
                            setSelectedRegion(null);
                            if (data.countries.includes(selectedCountry)) {
                              return (
                                <div
                                  key={region}
                                  className="bg-[#1a1a1a] p-4 flex flex-col gap-2 rounded-lg"
                                >
                                  {Object.entries(data.stats).map(
                                    ([key, value]) => (
                                      <div key={key}>
                                        <p className="text-[#e7e7e7] text-sm">
                                          {key
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                        </p>
                                        <p className="text-white text-xl font-bold">
                                          {value}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Map */}
          <div className="md:col-span-8 w-full mb-5">
            <Card className="bg-gray-300 border-[#363636] w-full mx-auto max-w-[550px]">
              <CardContent className="p-4 md:p-6 flex justify-center w-full items-center">
                <ComposableMap
                  projection="geoMercator" // Ensures proper projection
                  projectionConfig={{
                    scale: 450, // Adjusted scale for better fit
                    center: [15, 5], // Adjust this to keep Africa centered
                  }}
                  width={900} // Adjust width
                  height={700} // Adjust height
                >
                  <Geographies geography={africaData}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => {
                            const countryName = geo.properties.name;
                            setSelectedCountry(countryName);
                            Object.entries(regions).forEach(
                              ([region, data]) => {
                                if (data.countries.includes(countryName)) {
                                  setSelectedRegion(region);
                                }
                              }
                            );
                          }}
                          style={{
                            default: {
                              fill: getCountryColor(geo),
                              stroke: "#363636",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: "#AD0000",
                              stroke: "#363636",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#AD0000",
                              stroke: "#363636",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                          }}
                        />
                      ))
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
