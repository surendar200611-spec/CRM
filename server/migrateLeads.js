const { db, admin } = require('./firebase');
const fs = require('fs');
const path = require('path');

const migrateLeads = async () => {
  try {
    const leadsPath = path.join(__dirname, 'data', 'leads.json');
    if (!fs.existsSync(leadsPath)) {
      console.log('No leads.json file found.');
      return;
    }

    const leadsData = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
    console.log(`Found ${leadsData.length} leads in leads.json`);

    const batch = db.batch();
    
    for (const lead of leadsData) {
      // Remove local ID if it exists, let Firestore generate one or use it if you want
      const { id, ...leadData } = lead;
      
      // Convert timestamps if they are in the format from the JSON
      if (leadData.createdAt && leadData.createdAt._seconds) {
        leadData.createdAt = admin.firestore.Timestamp.fromMillis(leadData.createdAt._seconds * 1000);
      } else {
        leadData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      }

      if (leadData.updatedAt && leadData.updatedAt._seconds) {
        leadData.updatedAt = admin.firestore.Timestamp.fromMillis(leadData.updatedAt._seconds * 1000);
      } else {
        leadData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      }

      const docRef = db.collection('leads').doc();
      batch.set(docRef, leadData);
    }

    await batch.commit();
    console.log('Migration successful: All leads stored in Firestore.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateLeads();
