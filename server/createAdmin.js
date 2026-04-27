const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const createAdmin = async () => {
  try {
    const user = await admin.auth().createUser({
      email: 'surendar@crm.com',
      password: 'sure2006@',
      displayName: 'Surendar'
    });
    console.log('Admin user created successfully:', user.uid);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();

