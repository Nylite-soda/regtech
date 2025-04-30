import React from 'react';
import { Card, CardContent } from './ui/card';
import { ArrowRight } from 'lucide-react';

const regTechNewsData = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "RegTech Sector Poised to Dominate Nigerian Start-ups by 2026",
    description:
      "A recent report by RegTech Africa and Agpaytech indicates that Nigeria's RegTech sector is projected to grow by 40% among start-ups by the end of 2026.",
    url: "https://regtechafrica.com/news/nigeria-regtech-growth",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/7567433/pexels-photo-7567433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Global RegTech Market Anticipated to Reach $22.2 Billion by 2027",
    description:
      "According to industry analysts, the global Regulatory Technology (RegTech) market is expected to grow at a compound annual growth rate (CAGR) of 20.3%, reaching $22.2 billion by 2027.",
    url: "https://regtechafrica.com/news/global-market-growth",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "CUBE Completes Acquisition of Thomson Reuters Regulatory Intelligence",
    description:
      "On December 31, 2024, CUBE, a global leader in Automated Regulatory Intelligence (ARI), finalized its acquisition of Thomson Reuters Regulatory Intelligence and Oden Businesses.",
    url: "https://regtechafrica.com/news/cube-acquisition",
  },
];

const FeaturedNews = () => {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="bg-[#AD0000] h-10 w-3 absolute left-0 top-0 rounded-sm" />
              <h2 className="text-2xl md:text-3xl font-bold pl-5 relative">
                RegTech News
                <span className="block h-1 w-20 bg-[#AD0000] mt-2" />
              </h2>
            </div>
            
            <a 
              href="https://regtechafrica.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-gray-700 hover:text-[#AD0000] transition-colors duration-300 group"
            >
              <span className="font-medium">See all news</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#AD0000] transition-colors duration-300">
                <ArrowRight size={16} className="text-gray-700 group-hover:text-white transition-colors duration-300" />
              </span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {regTechNewsData.map((item) => (
            <a 
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="h-full border border-gray-200 transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-gray-300 group-hover:translate-y-[-4px]">
                <CardContent className="p-0">
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 transition-colors duration-300 group-hover:text-[#AD0000]">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                    <div className="mt-2 text-sm font-medium text-[#AD0000] flex items-center opacity-0 transform translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Read more
                      <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://regtechafrica.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center py-2.5 px-6 rounded-full bg-gray-100 hover:bg-[#AD0000] text-gray-900 hover:text-white transition-all duration-300 group font-medium"
          >
            Explore more news
            <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;