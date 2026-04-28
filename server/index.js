const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db, admin } = require('./firebase');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
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
    const savedDoc = await docRef.get();
    
    res.status(201).json({
      id: docRef.id,
      ...savedDoc.data()
    });
  } catch (error) {
    console.error('Error creating lead:', error);
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
    console.error('Error deleting lead:', error);
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
    console.error('Error updating lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get CRM Stats
app.get('/api/stats', async (req, res) => {
  try {
    const leadsRef = db.collection('leads');
    
    // Use parallel count queries for maximum speed
    const [totalSnap, newSnap, contactedSnap, convertedSnap] = await Promise.all([
      leadsRef.count().get(),
      leadsRef.where('status', '==', 'new').count().get(),
      leadsRef.where('status', '==', 'contacted').count().get(),
      leadsRef.where('status', '==', 'converted').count().get()
    ]);

    const stats = {
      total: totalSnap.data().count,
      new: newSnap.data().count,
      contacted: contactedSnap.data().count,
      converted: convertedSnap.data().count,
    };
    
    stats.successRate = stats.total > 0 
      ? Math.round((stats.converted / stats.total) * 100) 
      : 0;
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


