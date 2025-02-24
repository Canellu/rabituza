import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const MAP_LOAD_DOC_ID = 'mapLoadCount';

export const incrementMapLoadCount = async (): Promise<void> => {
  try {
    const mapLoadRef = doc(db, 'mapLoads', MAP_LOAD_DOC_ID);
    const mapLoadSnap = await getDoc(mapLoadRef);

    if (mapLoadSnap.exists()) {
      await updateDoc(mapLoadRef, {
        count: increment(1),
      });
    } else {
      await setDoc(mapLoadRef, {
        count: 1,
      });
    }
    console.log('Map load count incremented successfully!');
  } catch (error) {
    console.error('Error incrementing map load count:', error);
    throw error;
  }
};
