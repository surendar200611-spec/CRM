const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialized successfully.");
  
  admin.auth().listUsers(1)
    .then((listUsersResult) => {
      console.log("Auth Service is reachable.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error communicating with Auth Service:", error.code);
      if (error.code === 'auth/operation-not-allowed') {
        console.log("CRITICAL: Email/Password login is DISABLED in Firebase Console.");
      }
      process.exit(1);
    });
} catch (e) {
  console.error("Initialization error:", e.message);
  process.exit(1);
}
