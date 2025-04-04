import React from "react";

type AdProps = { src: string };

const Ad = (props: AdProps) => {
  return (
    <section className="flex flex-col w-full items-center gap-[50px]">
      <div className="flex flex-col w-full max-w-[1450px] items-start gap-[50px]">
        <img className="w-full" alt="Ad" src={props.src} />
      </div>
    </section>
  );
};

export default Ad;
