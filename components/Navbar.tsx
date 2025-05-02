"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Briefcase,
  Menu,
  Moon,
  User,
  LogOut,
  Sun,
  Home,
  Building2,
  Newspaper,
  CreditCard,
  Search,
  LayoutDashboard,
  UserPlus,
  X,
} from "lucide-react";
import { getItem, logout, storeRedirectUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
  {
    title: "News",
    href: "https://regtechafrica.com/",
    icon: Newspaper,
    items: [],
    status: "",
  },
  // {
  //   title: "Pricing",
  //   href: "/checkout",
  //   icon: CreditCard,
  //   items: [],
  //   status: "",
  // },
  {
    title: "Advanced Search",
    href: "/search",
    icon: Search,
    items: [],
    status: "",
  },
];

interface User {
  avatar?: string;
  first_name?: string;
  id?: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState(navigationItems);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
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
    setNavItems((prevItems) =>
      prevItems.map((navItem) => ({
        ...navItem,
        status: navItem.title === item ? "active" : "",
      }))
    );
  }

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search?search_term=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsSearchVisible(false);
    }
  };

  const handleSearchIconClick = () => {
    router.push("/search");
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-7xl mx-auto">
      <div className="relative">
        {/* Glass background with improved shadow */}
        <div className="absolute inset-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-[#333333]/20 shadow-lg dark:shadow-black/20" />

        {/* Content */}
        <div className="relative flex justify-between items-center h-16 px-4 sm:px-6">
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
              <span className="ml-2 sm:ml-3 text-base sm:text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-[#AD0000] dark:group-hover:text-[#FF4C4C] truncate max-w-[100px] sm:max-w-full">
                Regtech Horizon
              </span>
            </Link>
          </div>

          {/* Desktop Navigation with improved spacing */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8 mx-4 lg:mx-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] px-2 lg:px-3 py-2 text-sm font-medium transition-all duration-300 ${
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

          {/* Right side elements with improved spacing */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search toggle for tablet/mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchIconClick}
              className="md:hidden h-9 w-9 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300"
              aria-label="Advanced Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Search bar for desktop */}
            {/* <div className="hidden md:flex items-center max-w-xs lg:max-w-md relative">
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
            </div> */}

            {/* Theme Toggle - Desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex h-9 w-9 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* User dropdown or Sign in button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 px-2 sm:px-3 flex items-center space-x-1 sm:space-x-2 hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300"
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="User Avatar"
                        width={22}
                        height={22}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      {user.first_name}
                    </span>
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#AD0000] dark:bg-[#FF4C4C] animate-pulse" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-white/20 dark:border-[#333333]/20 w-48 shadow-lg dark:shadow-black/20 z-[9999]"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-colors duration-300">
                      <Link
                        href="/auth/company/register/"
                        className="flex items-center w-full"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        List a Company
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-colors duration-300">
                      <Link
                        href={`/dashboard/user/${user.first_name}`}
                        className="flex items-center w-full"
                      >
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
              <Link href="/auth/signin" className="hidden sm:block">
                <Button
                  onClick={storeRedirectUrl}
                  className="h-9 px-4 bg-[#AD0000] text-white hover:bg-[#AD0000]/90 text-sm transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button with improved animation */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden h-9 w-9 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 transition-all duration-300"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-4 w-4 transition-transform duration-300" />
              ) : (
                <Menu className="h-4 w-4 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay search bar that appears when toggled */}
      {isSearchVisible && (
        <div className="absolute top-16 left-0 right-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl rounded-b-2xl border-t border-white/20 dark:border-[#333333]/20 p-4 shadow-lg dark:shadow-black/20 transition-all duration-300 z-[998]">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-lg bg-white/50 dark:bg-[#2A2A2A]/50 border border-white/20 dark:border-[#333333]/20 focus:outline-none focus:ring-2 focus:ring-[#AD0000]/20 dark:focus:ring-[#FF4C4C]/20 transition-all duration-300"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => setIsSearchVisible(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#AD0000] dark:hover:text-[#FF4C4C] transition-colors duration-300 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  className="text-gray-500 dark:text-gray-400 hover:text-[#AD0000] dark:hover:text-[#FF4C4C] transition-colors duration-300 p-1"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Mobile menu with improved animation */}
      <div
        className={`md:hidden fixed inset-x-0 mx-auto w-[95%] max-w-7xl transition-all duration-300 z-[997] ${
          isOpen
            ? "mt-2 opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {isOpen && (
          <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-[#333333]/20 shadow-lg dark:shadow-black/20 overflow-hidden">
            <div className="px-4 py-3 space-y-2">
              {/* Search bar for mobile - now hidden since we redirect to advanced search */}
              {/* <form onSubmit={handleSearch} className="mb-2">
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
              </form> */}

              {/* Main Navigation Items with improved active state */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    item.status === "active"
                      ? "text-[#AD0000] dark:text-[#FF4C4C] bg-white/20 dark:bg-[#2A2A2A]/20 border-l-4 border-[#AD0000] dark:border-[#FF4C4C] scale-[1.02]"
                      : "text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    changeStatus(item.title);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              ))}

              {/* Additional Options for Logged-in Users */}
              {user && (
                <>
                  <div className="h-px bg-gray-200/50 dark:bg-[#333333]/50 my-2" />
                  <Link
                    href="/auth/company/register/"
                    className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>List a Company</span>
                  </Link>

                  <Link
                    href={`/dashboard/user/${user.id}`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Dashboard</span>
                  </Link>
                </>
              )}

              <div className="h-px bg-gray-200/50 dark:bg-[#333333]/50 my-2" />

              {/* Theme Toggle with improved hover effect */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 dark:text-[#B0B0B0] hover:text-[#AD0000] dark:hover:text-[#FF4C4C] hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10 justify-start"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>

              {/* Sign In or Logout Button */}
              {user ? (
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 text-red-600 hover:bg-white/20 dark:hover:bg-[#2A2A2A]/20 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10 justify-start"
                  variant="ghost"
                >
                  <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Logout</span>
                </Button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 bg-[#AD0000] text-white hover:bg-[#AD0000]/90 hover:scale-[1.02] hover:shadow-sm dark:hover:shadow-black/10"
                  onClick={() => {
                    storeRedirectUrl();
                    setIsOpen(false);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Sign In</span>
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
