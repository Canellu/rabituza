import {
  DocumentReference,
  WriteBatch,
  collection,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

async function deleteCollectionDocs(
  batch: WriteBatch,
  docRef: DocumentReference
) {
  // Get the routes subcollection reference
  const routesRef = collection(docRef, 'routes');

  // Get all documents in the routes subcollection
  const querySnapshot = await getDocs(routesRef);

  // Delete each document in the subcollection
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
}

export async function deleteActivity(userId: string, activityId: string) {
  const batch = writeBatch(db);

  // Get references
  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  // Delete routes subcollection from both locations
  await deleteCollectionDocs(batch, globalActivityRef);
  await deleteCollectionDocs(batch, userActivityRef);

  // Delete the main documents
  batch.delete(globalActivityRef);
  batch.delete(userActivityRef);

  // Commit all deletions in one batch
  await batch.commit();
}
