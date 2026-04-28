import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, CheckCircle, Globe, Link2, Share2, PhoneCall, ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const sources = [
  { id: 'Website', icon: <Globe size={20} /> },
  { id: 'LinkedIn', icon: <Link2 size={20} /> },
  { id: 'Referral', icon: <Share2 size={20} /> },
  { id: 'Cold Call', icon: <PhoneCall size={20} /> }
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/leads`, formData);
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', source: 'Website', status: 'new' });
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error adding lead:', error);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="main-content"
    >
      <header className="dashboard-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Lead Acquisition</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Onboard new prospects into the intelligence pipeline.</p>
        </div>
        <button 
          onClick={onSuccess} 
          className="glass-card" 
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Back to Intel
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'var(--primary)', opacity: 0.05, borderRadius: '0 0 0 100%' }}></div>
          
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '3rem' }}
              >
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 2rem'
                }}>
                  <CheckCircle size={60} color="var(--success)" />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Success! Prospect Onboarded</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Intelligence systems have been updated with the new lead data.</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
              >
                <div className="input-group">
                  <label>Prospect Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Alexander Pierce"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ paddingLeft: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="input-group">
                    <label>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
                      <input 
                        type="email" 
                        required 
                        placeholder="alex@nexus.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ paddingLeft: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
                      <input 
                        type="tel" 
                        placeholder="+1 (202) 555-0156"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        style={{ paddingLeft: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                  <label style={{ marginBottom: '1.2rem', display: 'block', fontWeight: 600 }}>Acquisition Channel</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                    gap: '15px' 
                  }}>
                    {sources.map(src => (
                      <motion.div 
                        key={src.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({...formData, source: src.id})}
                        className={`glass-card ${formData.source === src.id ? 'active-source' : ''}`}
                        style={{ 
                          padding: '20px', 
                          textAlign: 'center', 
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px',
                          border: formData.source === src.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: formData.source === src.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                          boxShadow: formData.source === src.id ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ color: formData.source === src.id ? 'var(--primary)' : 'var(--text-muted)', transition: '0.3s' }}>
                          {src.icon}
                        </div>
                        <span style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 600,
                          color: formData.source === src.id ? 'white' : 'var(--text-muted)'
                        }}>
                          {src.id}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'center', 
                    padding: '18px', 
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                    borderRadius: '14px'
                  }}
                >
                  {loading ? <div className="loader" style={{ width: '20px', height: '20px' }}></div> : (
                    <>
                      <UserPlus size={22} /> Initiate Onboarding
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--primary)" />
              Quality Assurance
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Verified Email Protocol',
                'Data Encryption Standard',
                'Automatic Lead Scoring',
                'Real-time Intel Update'
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '15px', 
              background: 'rgba(255,255,255,0.03)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Globe size={30} color="var(--text-muted)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Leads are synchronized across all authorized devices in <span style={{ color: 'white', fontWeight: 600 }}>real-time</span>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddLead;
