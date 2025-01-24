import { User } from '@/types/UserProfile';

const SESSION_KEY = 'auth_session';
const EXPIRY_DURATION = 24 * 60 * 60 * 1000 * 7; // 7 days in milliseconds

const isClientSide = typeof window !== 'undefined';

export const storeSession = (user: User) => {
  if (!isClientSide) return;
  const session = {
    user,
    expiry: Date.now() + EXPIRY_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): User | null => {
  if (!isClientSide) return null;
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  const parsedSession = JSON.parse(session);
  if (Date.now() > parsedSession.expiry) {
    // If session has expired, clear it from localStorage
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  return parsedSession.user;
};

export const clearSession = () => {
  if (!isClientSide) return;
  localStorage.removeItem(SESSION_KEY);
};
