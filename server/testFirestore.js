const { db } = require('./firebase');

const testFirestore = async () => {
  try {
    const snapshot = await db.collection('leads').limit(1).get();
    console.log('Firestore connection successful. Leads found:', snapshot.size);
    process.exit(0);
  } catch (error) {
    console.error('Firestore connection failed:', error);
    process.exit(1);
  }
};

testFirestore();
