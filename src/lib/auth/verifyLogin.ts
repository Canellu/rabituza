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

// Helper function to simulate OR behavior
async function getUserByIdentifier(identifier: string) {
  const usernameQuery = query(
    collection(db, 'users'),
    where('username', '==', identifier)
  );

  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', identifier)
  );

  // Execute both queries
  const [usernameSnapshot, emailSnapshot] = await Promise.all([
    getDocs(usernameQuery),
    getDocs(emailQuery),
  ]);

  // Combine the results in a Set to avoid duplicates
  const users = new Set();

  usernameSnapshot.forEach((doc) => users.add(doc.data()));
  emailSnapshot.forEach((doc) => users.add(doc.data()));

  return Array.from(users);
}

export async function verifyLogin(
  identifier: string,
  code: string
): Promise<User> {
  if (!identifier || !code) {
    const error: VerifyLoginError = {
      type: 'ValidationError',
      message: 'Identifier and code are required.',
    };
    throw error;
  }

  try {
    // Fetch user by username or email
    const users = await getUserByIdentifier(identifier);

    if (users.length === 0) {
      const error: VerifyLoginError = {
        type: 'UserNotFoundError',
        message: 'User not found.',
      };
      throw error;
    }

    // We assume the first match is the user (you may want to handle cases where multiple users match)
    const tmpUser = users[0] as User;
    // Convert Firestore Timestamp to Date
    const userData = {
      ...tmpUser,
      dob:
        tmpUser.dob instanceof Timestamp ? tmpUser.dob.toDate() : tmpUser.dob,
    };

    // Validate the provided code
    if (userData.code !== code) {
      const error: VerifyLoginError = {
        type: 'CodeMismatchError',
        message: 'The provided code is incorrect.',
      };
      throw error;
    }

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

export default verifyLogin;
