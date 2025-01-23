import { Timestamp } from 'firebase/firestore';

export const timestampToDate = (timestamp: Timestamp) => {
  timestamp.toDate();
};
