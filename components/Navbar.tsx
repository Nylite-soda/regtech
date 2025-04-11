"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Briefcase, Menu, Moon, User } from "lucide-react";
import { getItem } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
  {
    title: "Advanced Search",
    href: "/search",
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
        "fixed z-50 left-1/2 mt-7 bg-white/70 md:backdrop-blur-xl backdrop-blur-lg flex flex-col flex-wrap rounded-full md:flex-nowrap w-11/12 max-w-7xl -translate-x-1/2 items-center" +
        (isOpen
          ? "md:!h-auto !bg-white rounded-t-[37px] md:border-none border border-black/20 pb-4 rounded-b-2xl "
          : "")
      }
    >
      <div className="flex w-full items-center justify-between rounded-full border border-black/20 py-3 px-5 md:px-10 backdrop-blur-lg">
        <Link href="/">
          <button
            className="flex items-center gap-3 hover:cursor-pointer"
            onClick={() => changeStatus(navigationItems, "Home")}
            suppressHydrationWarning
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

        <div className="hidden md:flex md:items-center md:gap-10">
        <div className="hidden gap-10 lg:flex">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => changeStatus(navigationItems, item.title)}
                className="[text-shadow:_0_1px_0_rgb(235_235_235)] font-medium h-6"
                suppressHydrationWarning
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:flex ">
                <div className="items-center gap-2 hover:cursor-pointer">
                  <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">
                    {user.first_name}
                  </span>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 hidden lg:flex ">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/auth/company/register/" className="w-full">
                    List a Company
                  </Link>
                  <DropdownMenuShortcut><Briefcase /></DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Switch to Dark Mode
                  <DropdownMenuShortcut><Moon /></DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/dashboard/user/${user.id}`}><Button className="hover:cursor-pointer bg-[#AD0000] w-full text-white" suppressHydrationWarning>Dashboard</Button></Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

        ) : (
          <Link href="/auth/register" className="hidden lg:flex">
            <Button className="hover:cursor-pointer" suppressHydrationWarning>Register</Button>
          </Link>
        )}
      </div>

      <div className="lg:hidden">
        <Button
          size="icon"
          className="hover:cursor-pointer hover:bg-[#AD0000] hover:scale-[1.1]"
          onClick={() => setIsOpen(!isOpen)}
          suppressHydrationWarning
        >
          <Menu className="size-4 transition" color="white" />
        </Button>
      </div>
      </div>

      {isOpen && (
        <div className="relative w-full text-[#AD0000] flex flex-col items-center justify-end gap-1 px-5 py-3 lg:hidden">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}
                className="py-2 [text-shadow:_0_1px_0_rgb(235_235_235)] text-lg w-full hover:bg-[#AD0000] hover:text-white text-center"
                >
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}suppressHydrationWarning
              > 
                {item.title}
              </button>
            </Link>
          ))}
          {user ? (
            <Link href={`/dashboard/user/${user.id}`} className="w-full flex justify-center items-center">
            <Button className="hover:cursor-pointer bg-[#AD0000] w-[50%] h-[50px] mt-3 text-white" suppressHydrationWarning>Dashboard</Button>
          </Link>
          ):
          (
            <Link href="/auth/register" className="w-full flex justify-center items-center">
            <Button className="hover:cursor-pointer w-[50%] h-[50px] mt-3" suppressHydrationWarning>Register</Button>
          </Link>
          )
          }
        </div>
      )}
    </nav>
  );
};

export default Navbar;