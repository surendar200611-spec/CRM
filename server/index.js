const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Routes

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new lead
app.post('/api/leads', async (req, res) => {
  try {
    const newLead = {
      ...req.body,
      status: req.body.status || 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      notes: req.body.notes || []
    };
    const docRef = await db.collection('leads').add(newLead);
    res.status(201).json({ id: docRef.id, ...newLead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('leads').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead status or notes
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('leads').doc(id).update(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get CRM Stats
app.get('/api/stats', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').get();
    const leads = snapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      converted: leads.filter(l => l.status === 'converted').length,
    };
    
    stats.successRate = stats.total > 0 
      ? Math.round((stats.converted / stats.total) * 100) 
      : 0;
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
