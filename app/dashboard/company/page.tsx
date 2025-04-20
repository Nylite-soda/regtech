"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Building2, Globe, Mail, Phone, Link as LinkIcon } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useToast } from "@/components/ui/toast-context";
import ProfileProgressBar from "@/components/company/ProfileProgressBar";
import ProfileCompletionModal from "@/components/company/ProfileCompletionModal";
import { BASE_URL } from "@/lib/utils";

interface CompanyData {
  company_name: string;
  logo: string;
  description: string;
  headquarters: string;
  year_founded: number;
  company_size: string;
  company_type: string;
  niche: string;
  founders: string[];
  company_website: string;
  company_email: string;
  company_phone: string;
  social_media_linkedIn: string;
  social_media_ig: string;
  social_media_X: string;
  last_funding_date: string;
  status: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          showToast("Please log in to access the dashboard", "error");
          router.push("/auth/company-login");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/company/me`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyId(data.id);
          setCompanyData(data);
        } else {
          showToast("Failed to load company data", "error");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        showToast("An error occurred while loading your data", "error");
      }
    };

    fetchCompanyData();
  }, [router, showToast]);

  const handleProfileComplete = () => {
    setShowCelebrationModal(true);
  };

  if (!companyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Profile Card */}
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pt-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100">
                {companyData.logo ? (
                  <Image
                    src={companyData.logo}
                    alt={companyData.company_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">{companyData.company_name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={companyData.status === "active" ? "default" : "secondary"}>
                    {companyData.status}
                  </Badge>
                  <Badge variant="outline">{companyData.company_type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{companyData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{companyData.headquarters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Founded {companyData.year_founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{companyData.company_size} employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span>{companyData.niche}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <a href={`mailto:${companyData.company_email}`} className="text-blue-600 hover:underline">
                  {companyData.company_email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <a href={`tel:${companyData.company_phone}`} className="text-blue-600 hover:underline">
                  {companyData.company_phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-gray-500" />
                <a href={companyData.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Founders Card */}
          <Card>
            <CardHeader>
              <CardTitle>Founders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {companyData.founders.map((founder, index) => (
                  <Badge key={index} variant="secondary">
                    {founder}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Card */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyData.social_media_linkedIn && (
                <a
                  href={companyData.social_media_linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {companyData.social_media_ig && (
                <a
                  href={companyData.social_media_ig}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {companyData.social_media_X && (
                <a
                  href={companyData.social_media_X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-900 hover:underline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X (Twitter)
                </a>
              )}
            </CardContent>
          </Card>
        </div>
        
        {companyId && (
          <ProfileProgressBar 
            companyId={companyId} 
            onComplete={handleProfileComplete} 
          />
        )}
      </div>
      
      <ProfileCompletionModal 
        isOpen={showCelebrationModal} 
        onClose={() => setShowCelebrationModal(false)} 
      />
    </main>
  );
} 