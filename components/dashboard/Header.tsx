// components/dashboard/Header.tsx
"use client";
import { Bell, User } from "lucide-react";
import Image from "next/image";
import { UserData } from "@/types";
import NotificationBell from "../NotificationBell";
import { getItem } from "@/lib/utils";

interface HeaderProps {
  userData: UserData;
}

export default function Header({ userData }: HeaderProps) {
  return (
    <div className="bg-[#AD0000] text-white">
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* <NotificationBell
              userId={userData.id}
              authToken={localStorage.getItem("access_token")!}
            /> */}
            {/* <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}
            <div className="flex items-center gap-2">
              {userData.avatar ? (
                <Image
                  src={userData.avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              {/* {userData.avatar && (<Image src={userData.avatar} alt="" width={40} height={40} />)} || <User className="w-5 h-5" /> */}
              <span>
                {userData.first_name} {userData.last_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
