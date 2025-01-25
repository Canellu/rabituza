const SESSION_KEY = 'auth_session';
const EXPIRY_DURATION = 24 * 60 * 60 * 1000 * 7; // 7 days in milliseconds

const isClientSide = typeof window !== 'undefined';

export const setSession = (userId: string) => {
  if (!isClientSide) return;
  const session = {
    userId,
    expiry: Date.now() + EXPIRY_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): string | null => {
  if (!isClientSide) return null;
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  const parsedSession = JSON.parse(session);
  if (Date.now() > parsedSession.expiry) {
    // If session has expired, clear it from localStorage
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  return parsedSession.userId;
};

export const clearSession = () => {
  if (!isClientSide) return;
  localStorage.removeItem(SESSION_KEY);
};
