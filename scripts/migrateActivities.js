import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function updateActivityType(collectionRef) {
  const snapshot = await collectionRef.get();

  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.type === 'calisthenics' || data.type === 'gym') {
      const newType = 'workout';
      batch.update(doc.ref, { type: newType });
    }
  });

  await batch.commit();
}

async function migrateActivities() {
  try {
    // Update global activities collection
    const globalActivitiesRef = db.collection('activities');
    await updateActivityType(globalActivitiesRef);

    // Get all users
    const usersSnapshot = await db.collection('users').get();

    // Update each user's activities subcollection
    for (const userDoc of usersSnapshot.docs) {
      const userActivitiesRef = db.collection(`users/${userDoc.id}/activities`);
      await updateActivityType(userActivitiesRef);
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateActivities();