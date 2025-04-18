import { storeRedirectUrl } from './utils';

export function redirectToLogin() {
  storeRedirectUrl();
  window.location.href = '/auth/signin';
}

export function redirectToCompanyLogin() {
  storeRedirectUrl();
  window.location.href = '/auth/company-login';
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export function isCompanyAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('company');
} 