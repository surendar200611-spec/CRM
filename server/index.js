const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'leads.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper functions for data management
const getLeads = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads:', error);
    return [];
  }
};

const saveLeads = (leads) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving leads:', error);
    return false;
  }
};

app.use(cors());
app.use(express.json());

// Routes

// Get all leads
app.get('/api/leads', (req, res) => {
  try {
    const leads = getLeads();
    // Sort by createdAt desc (if available)
    leads.sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new lead
app.post('/api/leads', (req, res) => {
  try {
    const leads = getLeads();
    const now = Math.floor(Date.now() / 1000);
    const newLead = {
      id: uuidv4(),
      ...req.body,
      status: req.body.status || 'new',
      createdAt: { _seconds: now },
      updatedAt: { _seconds: now },
      notes: req.body.notes || []
    };
    leads.push(newLead);
    saveLeads(leads);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a lead
app.delete('/api/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    let leads = getLeads();
    leads = leads.filter(l => l.id !== id);
    saveLeads(leads);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead status or notes
app.patch('/api/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const leads = getLeads();
    const index = leads.findIndex(l => l.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const now = Math.floor(Date.now() / 1000);
    leads[index] = {
      ...leads[index],
      ...req.body,
      updatedAt: { _seconds: now }
    };
    
    saveLeads(leads);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get CRM Stats
app.get('/api/stats', (req, res) => {
  try {
    const leads = getLeads();
    
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

