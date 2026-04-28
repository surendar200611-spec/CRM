import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Mail, Phone, Calendar, MoreHorizontal, CheckCircle2, 
  Clock, UserCheck, Trash2, ChevronDown, Globe, 
  Link2, PhoneCall, Share2, TrendingUp, Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const SourceBadge = ({ source }) => {
  const getIcon = () => {
    switch (source?.toLowerCase()) {
      case 'website': return <Globe size={14} />;
      case 'linkedin': return <Link2 size={14} />;
      case 'referral': return <Share2 size={14} />;
      case 'cold call': return <PhoneCall size={14} />;
      default: return <Globe size={14} />;
    }
  };

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      padding: '4px 10px', 
      background: 'rgba(255,255,255,0.05)', 
      borderRadius: '6px',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
      fontSize: '0.8rem',
      fontWeight: 500
    }}>
      {getIcon()}
      <span>{source}</span>
    </div>
  );
};

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSourceDropdown, setActiveSourceDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/leads`),
        axios.get(`${API_BASE}/stats`)
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateLead = async (id, updates) => {
    try {
      await axios.patch(`${API_BASE}/leads/${id}`, updates);
      setActiveDropdown(null);
      setActiveSourceDropdown(null);
      fetchData(); // Refresh
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_BASE}/leads/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>Loading Dashboard...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="main-content"
    >
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient">Lead Intelligence</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your sales pipeline and client interactions.</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div onClick={() => setStatusFilter('all')} style={{ cursor: 'pointer' }}>
          <StatCard title="Total Leads" value={stats.total} icon={<UsersIcon />} color="var(--primary)" active={statusFilter === 'all'} />
        </div>
        <div onClick={() => setStatusFilter('new')} style={{ cursor: 'pointer' }}>
          <StatCard title="New Leads" value={stats.new} icon={<Clock color="#3b82f6" />} color="#3b82f6" active={statusFilter === 'new'} />
        </div>
        <div onClick={() => setStatusFilter('contacted')} style={{ cursor: 'pointer' }}>
          <StatCard title="Contacted" value={stats.contacted} icon={<UserCheck color="#f59e0b" />} color="#f59e0b" active={statusFilter === 'contacted'} />
        </div>
        <div onClick={() => setStatusFilter('converted')} style={{ cursor: 'pointer' }}>
          <StatCard title="Converted" value={stats.converted} icon={<CheckCircle2 color="#10b981" />} color="#10b981" active={statusFilter === 'converted'} />
        </div>
        <StatCard title="Success Rate" value={`${stats.successRate || 0}%`} icon={<TrendingUp color="#a855f7" />} color="#a855f7" />
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '20px' }}>
          <h2>Lead Pipeline</h2>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                paddingLeft: '40px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Status</th>
              <th>Source</th>
              <th>Contact</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="lead-row">
                <td>
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lead.email}</div>
                </td>
                <td>
                  <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                </td>
                <td style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setActiveSourceDropdown(activeSourceDropdown === lead.id ? null : lead.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <SourceBadge source={lead.source} />
                  </div>
                  
                  <AnimatePresence>
                    {activeSourceDropdown === lead.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel"
                        style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: 0, 
                          zIndex: 20, 
                          marginTop: '8px',
                          minWidth: '150px',
                          padding: '4px'
                        }}
                      >
                        {['Website', 'LinkedIn', 'Referral', 'Cold Call'].map(src => (
                          <div 
                            key={src}
                            className="dropdown-item"
                            style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px' }}
                            onClick={() => updateLead(lead.id, { source: src })}
                          >
                            {src}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a href={`mailto:${lead.email}`} title="Send Email" className="action-icon">
                      <Mail size={18} color="var(--primary)" />
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} title="Call Lead" className="action-icon">
                        <Phone size={18} color="#10b981" />
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.9rem' }}>
                    {lead.createdAt ? new Date(lead.createdAt._seconds * 1000).toLocaleDateString() : 'Just now'}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                    <div 
                      className="glass-card" 
                      style={{ 
                        padding: '6px 12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => setActiveDropdown(activeDropdown === lead.id ? null : lead.id)}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{lead.status}</span>
                      <ChevronDown size={14} style={{ transform: activeDropdown === lead.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </div>

                    <AnimatePresence>
                      {activeDropdown === lead.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="glass-panel"
                          style={{ 
                            position: 'absolute', 
                            top: '100%', 
                            left: 0, 
                            zIndex: 10, 
                            marginTop: '8px',
                            minWidth: '120px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            padding: '4px'
                          }}
                        >
                          {['new', 'contacted', 'converted'].map(status => (
                            <div 
                              key={status}
                              className="dropdown-item"
                              style={{ 
                                padding: '8px 12px', 
                                cursor: 'pointer', 
                                borderRadius: '6px',
                                textTransform: 'capitalize',
                                fontSize: '0.85rem',
                                color: lead.status === status ? 'var(--primary)' : 'inherit',
                                background: lead.status === status ? 'rgba(255,255,255,0.05)' : 'none'
                              }}
                              onClick={() => updateLead(lead.id, { status })}
                            >
                              {status}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={() => deleteLead(lead.id)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      title="Delete Lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, active }) => (
  <div className={`glass-panel stat-card ${active ? 'active-stat' : ''}`} style={{ 
    border: active ? `2px solid ${color}` : '1px solid var(--border)',
    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
      <div style={{ 
        padding: '8px', 
        background: active ? color : 'rgba(255,255,255,0.05)', 
        borderRadius: '8px',
        transition: '0.3s'
      }}>
        {active ? React.cloneElement(icon, { color: 'white' }) : icon}
      </div>
    </div>
    <div className="stat-value" style={{ color: active ? 'white' : 'inherit' }}>{value}</div>
    <div style={{ height: '4px', background: color, borderRadius: '2px', opacity: active ? 1 : 0.3 }}></div>
  </div>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M17 11a4 4 0 0 0 0-8"/>
  </svg>
);

export default Dashboard;
