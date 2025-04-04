import React from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const regTechNewsData = [
  {
    id: 1,
    image: "/images/image-7.png",
    title: "RegTech Sector Poised to Dominate Nigerian Start-ups by 2026",
    description:
      "A recent report by RegTech Africa and Agpaytech indicates that Nigeria's RegTech sector is projected to grow by 40% among start-ups by the end of 2026.....",
  },
  {
    id: 2,
    image: "/images/image-8.png",
    title: "Global RegTech Market Anticipated to Reach $22.2 Billion by 2027",
    description:
      "According to industry analysts, the global Regulatory Technology (RegTech) market is expected to grow at a compound annual growth rate (CAGR) of 20.3%, reaching $22.2 billion by 2027.....",
  },
  {
    id: 3,
    image: "/images/image-9.png",
    title:
      " CUBE Completes Acquisition of Thomson Reuters Regulatory Intelligence and Oden Businesses",
    description:
      "On December 31, 2024, CUBE, a global leader in Automated Regulatory Intelligence (ARI), finalized its acquisition of Thomson Reuters Regulatory Intelligence and.....",
  },
];

const FeaturedNews = () => {
  return (
    <div className="flex flex-col items-end md:gap-5 mx-auto w-full max-w-7xl mt-10 mb-5 md:p-6">
      <div className="flex justify-between w-full gap-4 md:gap-2  px-5 md:px-0">
        <div className="relative w-full">
          <div className="relative w-full h-[40px] md:w-[350px] md:h-[60px] rounded-l-xl overflow-hidden">
            <img
              className="absolute top-0 left-0 w-[350px] h-full object-cover"
              alt="Rectangle"
              src="/images/rectangle-19.svg" />
            <h2 className="absolute top-1/5 md:top-4 left-6 [font-family:'Satoshi-Medium',Helvetica] font-medium text-white text-xl md:text-2xl">
              Regtech News
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-[#323232] hover:text-[#AD0000] text-base md:text-xl leading-[21px] whitespace-nowrap">
          <Link href="https://regtechafrica.com/" className="flex items-center gap-1">
            See more
            <div className="bg-black rounded-full p-1 w-6 h-6 flex justify-center items-center">
              <img
                className="w-[21.42px] h-[16.42px] mr-[-1.42px]"
                alt="Vector"
                src="/images/arrow-right-3.svg"
              />
            </div>
          </Link>
        </div>
      </div>

      <div className=" overflow-x-auto no-scrollbar flex justify-around items-start gap-5 w-full flex-wrap md:flex-nowrap p-5 md:py-8 md:px-3 ">
        {regTechNewsData.map((item) => (
          <Card
            key={item.id}
            className="md:min-w-[385px] md:-top-5 md:h-[428px] border-none drop-shadow-xl border hover:scale-[1.01] transition"
          >
            <CardContent className="p-6 flex flex-col gap-3.5">
              <img
                className="w-full h-[200px] object-cover rounded-2xl border-2"
                alt="News image"
                src={item.image}
              />
              <div className="flex flex-col gap-2.5">
                <h3 className="mt-[-1.00px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-black dark:text-white text-lg xl:text-xl tracking-[0] leading-[25px]">
                  {item.title}
                </h3>
                <p className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-gray-400 dark:text-[#e7e7e7] text-sm xl:text-base tracking-normal md:tracking-wide leading-[21px]">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedNews;
