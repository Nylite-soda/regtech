import { useState } from "react";
import { Shield, Globe, ShieldAlert } from "lucide-react";
import SecuritySettings from "./SecuritySettings";
import PreferencesSettings from "./PreferencesSettings";
import DangerZone from "./DangerZone";
import { Company, UserData } from "@/types";

interface SettingsSectionProps {
  userData?: UserData;
  companyData?: Company;
}

const SettingsSection = ({ userData, companyData }: SettingsSectionProps) => {
  return (
    <div className="space-y-6">
      <SecuritySettings user={userData} company={companyData} />
      <PreferencesSettings />
      {companyData ? (
        <DangerZone company={companyData} />
      ) : (
        <DangerZone user={userData} isAdmin={userData?.is_superadmin} />
      )}
    </div>
  );
};

export default SettingsSection;
