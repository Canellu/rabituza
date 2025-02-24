import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const MAP_LOAD_DOC_ID = 'mapLoadCount';

export const getMapLoadCount = async (): Promise<number> => {
  try {
    const mapLoadRef = doc(db, 'mapLoads', MAP_LOAD_DOC_ID);
    const mapLoadSnap = await getDoc(mapLoadRef);
    return mapLoadSnap.exists() ? mapLoadSnap.data().count || 0 : 0;
  } catch (error) {
    console.error('Error getting map load count:', error);
    throw error;
  }
};
