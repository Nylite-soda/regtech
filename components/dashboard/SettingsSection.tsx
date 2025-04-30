import { useState } from 'react';
import { Shield, Globe, ShieldAlert } from 'lucide-react';
import SecuritySettings from './SecuritySettings';
import PreferencesSettings from './PreferencesSettings';
import DangerZone from './DangerZone';
import { UserData } from '@/types';

interface SettingsSectionProps {
  userData: UserData;
}

const SettingsSection = ({ userData }: SettingsSectionProps) => {
  return (
    <div className="space-y-6">
      <SecuritySettings user={userData} />
      <PreferencesSettings />
      <DangerZone userId={userData.id} />
    </div>
  );
};

export default SettingsSection;