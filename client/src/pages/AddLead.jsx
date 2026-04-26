import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, CheckCircle, Globe, Link2, Share2, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api';

const sources = [
  { id: 'Website', icon: <Globe size={18} /> },
  { id: 'LinkedIn', icon: <Link2 size={18} /> },
  { id: 'Referral', icon: <Share2 size={18} /> },
  { id: 'Cold Call', icon: <PhoneCall size={18} /> }
];

const AddLead = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'new'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/leads`, formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', source: 'Website', status: 'new' });
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="main-content"
    >
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient">Add New Prospect</h1>
        <p style={{ color: 'var(--text-muted)' }}>Capture fresh opportunities manually.</p>
      </header>

      <div className="glass-panel" style={{ maxWidth: '700px', padding: '2.5rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <h2>Lead Added Successfully!</h2>
            <p style={{ color: 'var(--text-muted)' }}>The database has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. John Smith"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ marginBottom: '1rem', display: 'block' }}>Lead Source</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '12px' 
              }}>
                {sources.map(src => (
                  <div 
                    key={src.id}
                    onClick={() => setFormData({...formData, source: src.id})}
                    className={`glass-card ${formData.source === src.id ? 'active-source' : ''}`}
                    style={{ 
                      padding: '16px', 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      border: formData.source === src.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: formData.source === src.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass)'
                    }}
                  >
                    <div style={{ color: formData.source === src.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {src.icon}
                    </div>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      color: formData.source === src.id ? 'white' : 'var(--text-muted)'
                    }}>
                      {src.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: '1rem' }}>
              <UserPlus size={20} />
              Register Lead
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default AddLead;
