import { User } from '@/types/UserProfile';
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

export type VerifyLoginError =
  | { type: 'ValidationError'; message: string }
  | { type: 'UserNotFoundError'; message: string }
  | { type: 'CodeMismatchError'; message: string }
  | { type: 'FirestoreError'; message: string; details?: string };

// Helper function to simulate OR behavior (Firestore doesn't support OR queries)
async function getUserByIdentifier(identifier: string) {
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

  return Array.from(users);
}

/**
 * Verifies the user identifier (username or email) and retrieves the user.
 */
export async function verifyUserIdentifier(identifier: string): Promise<User> {
  if (!identifier) {
    const error: VerifyLoginError = {
      type: 'ValidationError',
      message: 'Identifier is required.',
    };
    throw error;
  }

  try {
    // Get the user by normalized identifier (case-insensitive)
    const users = await getUserByIdentifier(identifier);

    if (users.length === 0) {
      const error: VerifyLoginError = {
        type: 'UserNotFoundError',
        message: 'User not found.',
      };
      throw error;
    }

    // Assume the first user match is the correct one
    const tmpUser = users[0] as User;

    // Convert Firestore Timestamp to Date if necessary
    const userData = {
      ...tmpUser,
      dob:
        tmpUser.dob instanceof Timestamp ? tmpUser.dob.toDate() : tmpUser.dob,
    };

    return userData;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const error: VerifyLoginError = {
        type: 'FirestoreError',
        message: 'An error occurred while querying Firestore.',
        details: err.message,
      };
      throw error;
    }
    throw err;
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
