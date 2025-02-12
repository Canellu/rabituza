import { NutritionTarget } from '@/types/Nutrition';
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createOrUpdateNutritionTarget(
  userId: string,
  targetData: Omit<NutritionTarget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const targetRef = collection(db, `users/${userId}/nutritionTargets`);
  const q = query(targetRef, limit(1)); // Get the first document, if any exists
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // If a target exists, update it
    const existingTargetDoc = querySnapshot.docs[0];
    const existingTargetRef = doc(
      db,
      `users/${userId}/nutritionTargets`,
      existingTargetDoc.id
    );

    await setDoc(
      existingTargetRef,
      {
        ...targetData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return existingTargetDoc.id;
  } else {
    // If no target exists, create a new one
    const targetId = doc(targetRef).id;
    const targetWithUserAndId = {
      ...targetData,
      id: targetId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const newTargetRef = doc(db, `users/${userId}/nutritionTargets`, targetId);
    await setDoc(newTargetRef, targetWithUserAndId);

    return targetId;
  }
}
