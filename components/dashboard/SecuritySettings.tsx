// components/dashboard/SecuritySettings.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { UserData } from '@/types';
import { BASE_URL } from '@/lib/utils';
import { useToast } from '@/components/ui/toast-context';

interface SecuritySettingsProps {
  user: UserData;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>();
  const { showToast } = useToast();

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Password change failed');
      }

      showToast('Password updated successfully!', 'success');
      reset();
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  return (
    <SectionWrapper icon={<Shield className="w-5 h-5" />} title="Security Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('current_password', { required: true })}
            placeholder="Current Password"
            className="w-full p-3 border rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {/* Add similar fields for new password and confirmation */}
        <button
          type="submit"
          className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
        >
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </button>
      </form>
    </SectionWrapper>
  );
}

const SectionWrapper = ({ 
  icon, 
  title, 
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    {children}
  </div>
);