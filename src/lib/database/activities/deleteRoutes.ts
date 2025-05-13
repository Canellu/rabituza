import { collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Deletes specific routes from an activity
 * @param userId The user ID
 * @param activityId The activity ID
 * @param routeIds Array of route IDs to delete
 */
export async function deleteRoutes(
  userId: string,
  activityId: string,
  routeIds: string[]
) {
  if (!routeIds.length) return;

  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);
  
  const globalRoutesRef = collection(globalActivityRef, 'routes');
  const userRoutesRef = collection(userActivityRef, 'routes');

  const deletePromises = [];
  
  for (const routeId of routeIds) {
    // Delete from global routes collection
    deletePromises.push(deleteDoc(doc(globalRoutesRef, routeId)));
    
    // Delete from user routes collection
    deletePromises.push(deleteDoc(doc(userRoutesRef, routeId)));
  }

  if (deletePromises.length > 0) {
    await Promise.all(deletePromises);
  }
}