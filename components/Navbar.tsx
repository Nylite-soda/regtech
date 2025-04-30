"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Briefcase, Menu, Moon, User, LogOut, Sun, Home, Building2, Newspaper, CreditCard, Search, LayoutDashboard, UserPlus } from "lucide-react";
import { getItem, logout, storeRedirectUrl } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme-provider";

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    items: [],
    status: "",
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
    items: [],
    status: "",
  },
  // {
  //   title: "News",
  //   href: "https://regtechafrica.com/",
  //   icon: Newspaper,
  //   items: [],
  //   status: "",
  // },
  {
    title: "Pricing",
    href: "/checkout",
    icon: CreditCard,
    items: [],
    status: "",
  },
  {
    title: "Advanced Search",
    href: "/search",
    icon: Search,
    items: [],
    status: "",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState(navigationItems);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const userData = getItem("user");
    setUser(userData);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  function changeStatus(item: string) {
    setNavItems(prevItems => 
      prevItems.map((navItem) => ({
        ...navItem,
        status: navItem.title === item ? "active" : "",
      }))
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!mounted) {
    return null;
  }
  
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-999 w-[95%] max-w-7xl mx-auto">
      <div className="relative">
        {/* Glass background with improved shadow */}
        <div className="absolute inset-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-[#333333]/20 shadow-lg dark:shadow-black/20" />
        
        {/* Content */}
        <div className="relative flex justify-between items-center h-16 px-6">
          {/* Logo with hover animation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/images/horizon-logo.png"
                  alt="Regtech Horizon"
                  width={32}
                  height={32}
                  className="w-auto h-auto transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-[#AD0000]/10 dark:bg-[#FF4C4C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="ml-3 min-w-[145px] text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-[#AD0000] dark:group-hover:text-[#FF4C4C]">
                Regtech Horizon
              </span>
            </Link>
          </div>

          {/* Right side buttons with improved spacing */}
          <div className="flex items-center space-x-4">
            
          {/* Desktop Navigation with improved spacing */}
          <div className="hidden lg:flex items-center space-x-8 mx-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  item.status === "active" 
                    ? "text-[#AD0000] dark:text-[#FF4C4C] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#AD0000] dark:after:bg-[#FF4C4C] after:rounded-full after:scale-x-100" 
                    : "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#AD0000] dark:after:bg-[#FF4C4C] after:rounded-full hover:after:w-full hover:after:scale-x-100 after:transition-all after:duration-300"
                }`}
                onClick={() => changeStatus(item.title)}
              >
                {item.title}
              </Link>
            ))}
          </div>
          
          {/* Search bar for desktop */}
          <div className="hidden xl:flex items-center flex-1 max-w-md">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-lg bg-white/50 dark:bg-[#2A2A2A]/50 border border-white/20 dark:border-[#333333]/20 focus:outline-none focus:ring-2 focus:ring-[#AD0000]/20 dark:focus:ring-[#FF4C4C]/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-[#AD0000] dark:hover:text-[#FF4C4C] transition-colors duration-300"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

            {/* Theme Toggle - Desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden lg:flex h-10 w-10 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300 hover:scale-110"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 px-4 flex items-center space-x-2 hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300 hover:scale-105"
                  >
                    {user.avatar ? (
                      <Image src={user.avatar} alt="User Avatar" width={25} height={25} className="rounded-full" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{user.first_name}</span>
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#AD0000] dark:bg-[#FF4C4C] animate-pulse" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border border-white/20 dark:border-[#333333]/20 w-48 shadow-lg dark:shadow-black/20 z-9999"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-colors duration-300">
                      <Link href="/auth/company/register/" className="flex items-center w-full">
                        <Briefcase className="mr-2 h-4 w-4" />
                        List a Company
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-colors duration-300">
                      <Link href={`/dashboard/user/${user.id}`} className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-[#333333]/50" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-colors duration-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin" className="hidden lg:block">
                <Button onClick={storeRedirectUrl} className="h-10 px-6 bg-[#AD0000] text-white hover:bg-[#AD0000]/90 text-sm transition-all duration-300 hover:scale-105">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button with improved animation */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden h-10 w-10 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300 hover:scale-110"
            >
              <Menu className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu with improved animation */}
      <div className={`lg:hidden transition-all duration-300 ${isOpen ? 'mt-2 opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        {isOpen && (
          <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-[#333333]/20 shadow-lg dark:shadow-black/20 overflow-hidden">
            <div className="px-4 py-3 space-y-2">
              {/* Search bar for mobile */}
              <form onSubmit={handleSearch} className="mb-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg bg-white/50 dark:bg-[#2A2A2A]/50 border border-white/20 dark:border-[#333333]/20 focus:outline-none focus:ring-2 focus:ring-[#AD0000]/20 dark:focus:ring-[#FF4C4C]/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-[#AD0000] dark:hover:text-[#FF4C4C] transition-colors duration-300"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Main Navigation Items with improved active state */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    item.status === "active"
                      ? "text-[#AD0000] dark:text-[#FF4C4C] bg-white/20 dark:bg-[#2A2A2A]/20 border-l-4 border-[#AD0000] dark:border-[#FF4C4C] scale-[1.02]"
                      : "text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    changeStatus(item.title);
                  }}
                >
                  {item.title}
                </Link>
              ))}
              
              {/* Additional Options for Logged-in Users */}
              {user && (
                <>
                  <div className="h-px bg-gray-200/50 dark:bg-[#333333]/50 my-2" />
                  <Link
                    href="/auth/company/register/"
                    className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Briefcase className="h-4 w-4 mr-2 inline-block" />
                    List a Company
                  </Link>
                </>
              )}
              
              <div className="h-px bg-gray-200/50 dark:bg-[#333333]/50 my-2" />
              
              {/* Theme Toggle with improved hover effect */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="text-left w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                )}
              </Button>

              {/* Dashboard/Register Button with improved hover effect */}
              {user ? (
                <Link
                  href={`/dashboard/user/${user.id}`}
                  className="block w-full px-4 py-2.5 text-sm text-center font-medium rounded-lg transition-all duration-300 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2 inline-block" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block w-full px-4 py-2.5 text-sm text-center font-medium rounded-lg transition-all duration-300 bg-[#AD0000] text-white hover:bg-[#AD0000]/90 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                  onClick={() => {
                    storeRedirectUrl();
                    setIsOpen(false)
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2 inline-block" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;