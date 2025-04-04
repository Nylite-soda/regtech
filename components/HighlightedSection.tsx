import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const companies = [
  {
    id: 1,
    name: "PaySwift",
    category: "Fintech & Payments",
    description:
      "PaySwift is a seamless payment processing platform that enables businesses to accept online and offline transactions with secure, instant settlements.",
    location: "Nairobi, Kenya",
    founded: "2018",
    rating: "4.7",
    logo: "/images/image-1.png",
  },
  {
    id: 2,
    name: "MediLink",
    category: "HealthTech",
    description:
      "MediLink connects patients with top healthcare providers, offering telemedicine, electronic health records, and AI-powered diagnostics for improved healthcare access.",
    location: "Cape Town, South Africa",
    founded: "2020",
    rating: "4.6",
    logo: "/images/image-3.png",
  },
  {
    id: 3,
    name: "AgriTech Solutions",
    category: "Agriculture & AgriTech",
    description:
      "AgriTech Solutions leverages AI and IoT to optimize farming efficiency, reduce waste, and provide real-time insights for better crop management.",
    location: "Accra, Ghana",
    founded: "2015",
    rating: "4.4",
    logo: "/images/image-1.png",
  },
  {
    id: 4,
    name: "EduPro",
    category: "EdTech",
    description:
      "EduPro is a personalized e-learning platform that provides interactive courses, AI tutors, and skill-based training programs for students and professionals.",
    location: "Abuja, Nigeria",
    founded: "2019",
    rating: "4.8",
    logo: "/images/image-3.png",
  },
  {
    id: 5,
    name: "EcoCharge",
    category: "Renewable Energy",
    description:
      "EcoCharge provides affordable solar and renewable energy solutions, helping households and businesses reduce carbon footprints and achieve energy independence.",
    location: "Kigali, Rwanda",
    founded: "2016",
    rating: "4.7",
    logo: "/images/image-1.png",
  },
];

const HighlightedSection = () => {
  return (
    <section className="flex flex-col w-full mx-auto mt-10 p-3 md:p-6 justify-center gap-5 max-w-7xl">
      <div className="relative mx-5 md:mx-0">
      <div className="relative w-full h-[40px] md:w-[350px] md:h-[60px] rounded-l-xl overflow-hidden">
            <img
              className="absolute top-0 left-0 w-[350px] h-full object-cover"
              alt="Rectangle"
              src="/images/rectangle-19.svg" />
          <h2 className="absolute top-1/4 md:top-4 left-6 [font-family:'Satoshi-Medium',Helvetica] font-medium text-white text-xl md:text-2xl">
            Highlighted Companies
          </h2>
        </div>
      </div>
      <div className="relative flex max-w-full  md:items-center items-end justify-between mx-5 md:mx-0">
        <div className="flex flex-col gap-3">
          <span className="text-gray-400 font-medium">Categories:</span>
          <div className="flex gap-3 items-center flex-wrap">
            <Button
              variant="secondary"
              className="hover:cursor-pointer px-4 py-1.5 active:bg-[#323232] active:text-white border-2 rounded-xl border-gray-300 font-medium"
            >
              AML
            </Button>
            <Button
              variant="secondary"
              className="hover:cursor-pointer px-4 py-1.5 active:bg-[#323232] active:text-white border-2 rounded-xl border-gray-300 font-medium"
            >
              KYC
            </Button>
            <Button
              variant="secondary"
              className="hover:cursor-pointer px-4 py-1.5 active:bg-[#323232] active:text-white border-2 rounded-xl border-gray-300 font-medium"
            >
              Regulatory
            </Button>
            <Button
              variant="secondary"
              className="hover:cursor-pointer px-4 py-1.5 active:bg-[#323232] active:text-white border-2 rounded-xl border-gray-300 font-medium"
            >
              Compliance
            </Button>
            <Button
              variant="secondary"
              className="hover:cursor-pointer px-4 py-1.5 active:bg-[#323232] active:text-white border-2 rounded-xl border-gray-300 font-medium"
            >
              SupTech
            </Button>
          </div>
        </div>

        <div className="flex gap-2 md:gap-5 absolute bottom-0 right-0">
          <Button
            variant="outline"
            className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] bg-[#373737] rounded-[35px] rotate-180 p-0 border-none hover:bg-[#AD0000] hover:cursor-pointer"
            aria-label="Previous company"
          >
            <img
              className="w-[25px] md:w-[25px] md:h-[35px] -rotate-180"
              alt="Arrow right"
              src="/images/arrow-right-1.svg"
            />
          </Button>

          <Button
            variant="outline"
            className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] bg-[#373737] rounded-[35px] p-0 border-none hover:bg-[#AD0000] hover:cursor-pointer"
            aria-label="Next company"
          >
            <img
              className="w-[25px] md:w-[25px] md:h-[35px]"
              alt="Arrow right"
              src="/images/arrow-right-3.svg"
            />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5 w-full overflow-x-auto no-scrollbar p-2">
        {companies.map((company) => (
          <Card
            key={company.id}
            className="relative w-[325px] md:w-[630px] h-[400px] md:h-[380px] rounded-2xl flex-shrink-0 drop-shadow-lg border border-gray-300 hover:scale-[1.01] transition"
          >
            <CardContent className=" relative flex flex-col h-full md:h-[380px] items-start gap-5 pt-[25px] md:pt-[42px] px-[30px] w-full">
              <div className="flex items-center gap-5 lg:gap-[70px] w-full">
                <div className="flex items-center gap-3.5">
                  <img
                    className="w-[95px] md:w-[120px] h-[95x] md:h-[120px] object-cover rounded-2xl border-gray-300 border-2"
                    alt={`${company.name} logo`}
                    src={company.logo}
                  />

                  <div className="flex flex-col w-[246px] items-start">
                    <h3 className="[font-family:'Satoshi-Medium',Helvetica] text-black font-medium dark:text-white text-2xl md:text-4xl">
                      {company.name}
                    </h3>

                    <div className="flex flex-col items-start gap-1 w-full">
                      <p className="[font-family:'Satoshi-Medium',Helvetica] text-[#373737] font-medium dark:text-[#e7e7e7] text-base md:text-lg leading-6">
                        {company.category}
                      </p>
                    </div>

                    <Link href="/companies">
                      <Button className="mt-1 md:hidden w-[90px] h-8 hover:bg-black hover:scale-[1.02] hover:cursor-pointer dark:bg-white rounded [font-family:'Satoshi-Bold',Helvetica] font-bold bg-[#080808] text-xs">
                        View profile
                      </Button>
                    </Link>
                  </div>
                </div>

                <Link href="/companies">
                <Button className="hidden md:block w-[120px] h-12 hover:bg-black hover:scale-[1.02] hover:cursor-pointer dark:bg-white rounded-xl [font-family:'Satoshi-Bold',Helvetica] font-bold bg-[#080808] text-base">
                  View profile
                </Button>
                </Link>
              </div>

              <div className="flex flex-1 flex-col items-start gap-[30px] w-full">
                <p className="[font-family:'Satoshi-Medium',Helvetica] text-gray-400 font-medium dark:text-[#e7e7e7] text-base tracking-wide leading-[22px]">
                  {company.description}
                </p>

                <div className="absolute flex justify-start gap-3 w-full items-start bottom-6">
                  <div className="flex flex-col items-start gap-2 w-[40%]">
                    <span className="[font-family:'Satoshi-Medium',Helvetica] text-gray-500 font-medium dark:text-[#e7e7e7] text-base text-center leading-[14px] whitespace-nowrap">
                      Location:
                    </span>

                    <span className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-gray-400 dark:text-white text-base md:text-lg leading-6">
                      {company.location}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <span className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-gray-500 dark:text-[#e7e7e7] text-base text-center leading-[14px] whitespace-nowrap">
                      Founded:
                    </span>

                    <span className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-gray-400 dark:text-white text-lg leading-6">
                      {company.founded}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HighlightedSection;
