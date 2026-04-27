const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const createAdmin = async () => {
  try {
    const email = 'surendar@crm.com';
    const password = 'sure2006@';
    
    // Check if user already exists
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      console.log('Admin user already exists with UID:', existingUser.uid);
      
      // Update password just in case
      await admin.auth().updateUser(existingUser.uid, { password });
      console.log('Admin password updated successfully.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        const user = await admin.auth().createUser({
          email,
          password,
          displayName: 'Surendar'
        });
        console.log('Admin user created successfully with UID:', user.uid);
      } else {
        throw error;
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error in createAdmin:', error);
    process.exit(1);
  }
};

createAdmin();
