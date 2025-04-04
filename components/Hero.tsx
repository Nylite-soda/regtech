import React from "react";
import SearchBar from "./ui/SearchBar";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-white/100 via-white/90 to-white/50 relative pb-5">
      {/* <Image src="/images/hero-img.png" width={} height={auto}/> */}
      <img
        src="/images/hero-img.png"
        alt=""
        className="w-full h-full object-cover absolute -z-10"
      />
      <div className="pt-28 sm:pt-32 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center flex flex-col justify-center items-center">
          <h1 className="max-w-3xl mt-5 px-6 text-4xl text-gray-900 tracking-tight sm:text-6xl font-bold leading-tighter">
            Discover Africa’s Leading{" "}
            <span className="text-[#AD0000]">RegTech</span> Companies
          </h1>
          <p className="px-6 text-lg text-rdms font-medium my-4">
            Discover & Connect with Top RegTech Firms – Explore Insights, Trends
            & Growth Opportunities!
          </p>
        </div>
        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
