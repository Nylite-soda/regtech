import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

/**
 * Hook to handle authentication redirects
 * Captures the current path and stores it for redirect after authentication
 */
export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  /**
   * Store the current path and redirect to the auth page
   * @param authType - The type of auth page to redirect to ('signin' or 'register')
   */
  const redirectToAuth = (authType: 'signin' | 'register') => {
    // Don't store the auth pages themselves as redirect targets
    if (pathname.includes('/auth/')) {
      router.push(`/auth/${authType}`);
      return;
    }
    
    // Store the current path in sessionStorage
    sessionStorage.setItem('authRedirectPath', pathname);
    
    // Redirect to the auth page
    router.push(`/auth/${authType}`);
  };
  
  /**
   * Get the stored redirect path and clear it
   * @returns The path to redirect to, or null if none exists
   */
  const getRedirectPath = (): string | null => {
    const redirectPath = sessionStorage.getItem('authRedirectPath');
    sessionStorage.removeItem('authRedirectPath');
    return redirectPath;
  };
  
  return {
    redirectToAuth,
    getRedirectPath
  };
}; 