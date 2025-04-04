import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const PremiumFeaturesSection = () => {
  return (
    <div className="w-full bg-[#111111] flex flex-wrap md:flex-nowrap items-start justify-around gap-5 md:gap-10 pt-10 p-4 md:p-15">
      <div className="relative rounded-xl w-full h-[200px] md:w-[500px] md:h-[350px] bg-no-repeat bg-[url(/images/image-10.png)] bg-cover bg-[50%_50%]"></div>

      <div className="self-center flex flex-col md:w-[50%] items-start gap-[30px]">
        <div className="flex flex-col items-start gap-2 w-full">
          <h2 className="w-full [font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-2xl md:text-4xl tracking-[0] leading-[32px] md:leading-[40px]">
            Unlock Exclusive Insights &amp; Premium Features
          </h2>
          <p className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-[#e7e7e7] text-lg md:text-xl tracking-[0] leading-[24px] md:leading-[30px]">
            Join RegTech Horizon to access in-depth company profiles, real-time
            industry updates, and advanced compliance tools. Upgrade your
            experience and stay ahead in the RegTech space.
          </p>
        </div>

        <Link href="/">
          <Button className="self-center md:self-start hover:cursor-pointer [font-family:'Satoshi-Bold',Helvetica] font-bold w-[200px] h-[60px] bg-white rounded-xl text-base hover:border hover:border-white text-[#080808] hover:text-white">
            <span className="">Join Regtech Horizon</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PremiumFeaturesSection;
