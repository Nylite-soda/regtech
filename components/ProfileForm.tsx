'use client';

import { useState } from 'react';
import { User, Camera, Check, X } from 'lucide-react';
import Image from 'next/image';

type ProfileData = {
  id: string,
  subscription: string,
  phone_number: number | null,
  password: string,
  confirm_new_password: string,
  first_name: string,
  last_name: string,
  email: string;
  profilePicture?: string;
}

export default function ProfileForm(data: ProfileData) {
  const [profile, setProfile] = useState<ProfileData>(data);

  const [changes, setChanges] = useState<Partial<ProfileData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showNoChanges, setShowNoChanges] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setChanges({ ...changes, [field]: value });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (Object.keys(changes).length === 0) {
      setShowNoChanges(true);
      setTimeout(() => setShowNoChanges(false), 3000);
      return;
    }

    // Here you would typically make an API call to update the profile
    setProfile({ ...profile, ...changes });
    setChanges({});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setChanges({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          {profile.profilePicture ? (
            <Image
              src={profile.profilePicture}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <button className="absolute bottom-0 right-0 p-2 bg-[#AD0000] text-white rounded-full hover:bg-[#AD0000]/90">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={changes.first_name ?? profile.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={changes.last_name ?? profile.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={changes.email ?? profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
          />
          <p className="mt-1 text-sm text-gray-500">
            Changing your email will require verification
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={changes.phone_number?.toString() ?? profile.phone_number?.toString()}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
          />
        </div>

        <div className="pt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Changes
            </button>
            {isEditing && (
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            )}
          </div>
          {showNoChanges && (
            <p className="mt-2 text-sm text-gray-500">No changes were made</p>
          )}
        </div>
      </div>
    </div>
  );
} 