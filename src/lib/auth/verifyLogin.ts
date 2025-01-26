import { User } from '@/types/UserProfile';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

export type VerifyLoginError =
  | { type: 'ValidationError'; message: string }
  | { type: 'UserNotFoundError'; message: string }
  | { type: 'CodeMismatchError'; message: string }
  | { type: 'FirestoreError'; message: string; details?: string };

export async function getUserByIdentifier(identifier: string): Promise<User[]> {
  try {
    const normalizedIdentifier = identifier.toLowerCase();
    const usernameQuery = query(
      collection(db, 'users'),
      where('username', '==', normalizedIdentifier)
    );

    const emailQuery = query(
      collection(db, 'users'),
      where('email', '==', normalizedIdentifier)
    );

    const [usernameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(emailQuery),
    ]);

    const users = new Set();
    usernameSnapshot.forEach((doc) => users.add(doc.data()));
    emailSnapshot.forEach((doc) => users.add(doc.data()));

    return Array.from(users) as User[];
  } catch (err) {
    throw {
      type: 'FirestoreError',
      message: 'Failed to fetch users from Firestore',
      details: (err as Error).message,
    } as VerifyLoginError;
  }
}

/**
 * Verifies the provided code for the user.
 */
export function verifyUserCode(user: User, code: string): User {
  if (!code) {
    const error: VerifyLoginError = {
      type: 'ValidationError',
      message: 'Code is required.',
    };
    throw error;
  }

  if (user.code !== code) {
    const error: VerifyLoginError = {
      type: 'CodeMismatchError',
      message: 'The provided code is incorrect.',
    };
    throw error;
  }

  return user;
}
