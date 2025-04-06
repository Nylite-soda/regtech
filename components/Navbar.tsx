"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, User } from "lucide-react";
import { getItem } from "@/lib/utils";

let navigationItems = [
  {
    title: "Home",
    href: "/",
    items: [],
    status: "",
  },
  {
    title: "Companies",
    href: "/companies",
    items: [],
    status: "",
  },
  {
    title: "News",
    href: "https://regtechafrica.com/",
    items: [],
    status: "",
  },
  {
    title: "Pricing",
    href: "/checkout",
    items: [],
    status: "",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState(navigationItems);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to handle client-side only operations
  useEffect(() => {
    setIsClient(true);
    const userData = getItem("user");
    setUser(userData);
  }, []);

  function changeStatus(navItems: typeof navigationItems, item: string) {
    navigationItems = navItems.map((navItem) => ({
      ...navItem,
      status: navItem.title === item ? "active" : "",
    }));
    setNavItems(navigationItems);
  }
  
  return (
    <nav
      className={
        "fixed z-50 left-1/2 mt-7 flex flex-wrap md:!rounded-full md:flex-nowrap w-11/12 max-w-7xl -translate-x-1/2 items-center" +
        (isOpen
          ? " h-[235px] md:!h-auto rounded-t-[37px] md:backdrop-blur-xl md:border-none border border-black/20 backdrop-blur-lg  rounded-b-2xl "
          : "")
      }
    >
      <div className="flex w-full items-center justify-between rounded-full border border-black/20 py-3 px-5 md:px-10 backdrop-blur-lg">
        <Link href="/">
          <button
            className="flex items-center gap-3 hover:cursor-pointer"
            onClick={() => changeStatus(navigationItems, "Home")}
          >
            <Image
              src="/images/horizon-logo.png"
              alt="Regtech Horizon"
              width={45}
              height={45}
            />
            <h2 className="font-semibold text-xl [text-shadow:_0_1px_0_rgb(235_235_235)]">
              Regtech Horizon
            </h2>
          </button>
        </Link>

        <div className="hidden gap-10 md:flex">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => changeStatus(navigationItems, item.title)}
                className="[text-shadow:_0_1px_0_rgb(235_235_235)] font-medium h-6"
              >
                <span
                  className={
                    "pb-1 hover:text-[#AD0000] hover:[text-shadow:_none] hover:border-b-2 !hover:border-[#AD0000] " +
                    (item.status === "active"
                      ? "text-[#AD0000]"
                      : "text-black")
                  }
                >
                  {item.title}
                </span>
              </button>
            </Link>
          ))}
        </div>
        
        {isClient && user ? (
          <Link href={`/dashboard/user/${user.id}`} className="flex items-center gap-2">
            <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="hidden md:block font-semibold">
              {user.first_name}
            </span>
          </Link>
        ) : (
          <Link href="/auth/register">
            <Button className="hover:cursor-pointer">Register</Button>
          </Link>
        )}
      </div>

      <div className="md:hidden">
        <Button
          size="icon"
          className="hover:cursor-pointer bg-[#AD0000] hover:scale-[1.1]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="size-4 transition" color="white" />
        </Button>
      </div>

      {isOpen && (
        <div className="relative -top-[35px] pt-[53.5px] w-full text-[#AD0000] flex flex-col items-center justify-center gap-3 px-5 py-3 md:hidden">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="py-1 [text-shadow:_0_1px_0_rgb(235_235_235)] text-lg w-full hover:bg-[#AD0000] hover:text-white text-center"
              > 
                {item.title}
              </button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;