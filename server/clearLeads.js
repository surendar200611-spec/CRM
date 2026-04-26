const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const clearLeads = async () => {
  try {
    const snapshot = await db.collection('leads').get();
    if (snapshot.empty) {
      console.log('No leads to delete.');
      process.exit(0);
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Successfully deleted ${snapshot.size} leads.`);
    process.exit(0);
  } catch (error) {
    console.error('Error clearing leads:', error.message);
    process.exit(1);
  }
};

clearLeads();
