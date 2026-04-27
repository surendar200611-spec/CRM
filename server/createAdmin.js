const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const createAdmin = async () => {
  try {
    const user = await admin.auth().createUser({
      email: 'admin@dolfin.com',
      password: 'admin123@password',
      displayName: 'System Admin'
    });
    console.log('Admin user created successfully:', user.uid);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
