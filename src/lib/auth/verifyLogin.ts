import { User } from '@/types/UserProfile';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

export type VerifyLoginError =
  | { type: 'ValidationError'; message: string }
  | { type: 'UserNotFoundError'; message: string }
  | { type: 'CodeMismatchError'; message: string }
  | { type: 'FirestoreError'; message: string; details?: string };

// Helper function to simulate OR behavior (Firestore doesn't support OR queries)
export async function getUserByIdentifier(identifier: string) {
  // Convert identifier to lowercase to ensure case-insensitive comparison
  const normalizedIdentifier = identifier.toLowerCase();

  // Create Firestore queries for username and email (converted to lowercase)
  const usernameQuery = query(
    collection(db, 'users'),
    where('username', '==', normalizedIdentifier)
  );

  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', normalizedIdentifier)
  );

  // Execute both queries in parallel
  const [usernameSnapshot, emailSnapshot] = await Promise.all([
    getDocs(usernameQuery),
    getDocs(emailQuery),
  ]);

  // Combine results to avoid duplicates (using a Set)
  const users = new Set();

  usernameSnapshot.forEach((doc) => users.add(doc.data()));
  emailSnapshot.forEach((doc) => users.add(doc.data()));

  return Array.from(users) as User[];
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
