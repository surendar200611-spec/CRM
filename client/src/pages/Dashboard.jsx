import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Mail, Phone, Calendar, MoreHorizontal, CheckCircle2, 
  Clock, UserCheck, Trash2, ChevronDown, Globe, 
  Link2, PhoneCall, Share2, TrendingUp, Search,
  ArrowUpRight, Users, Target, Activity, Zap, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#3b82f6'];

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
  const [selectedLead, setSelectedLead] = useState(null);

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

  // Chart Data Preparation
  const pieData = [
    { name: 'New', value: stats.new || 0 },
    { name: 'Contacted', value: stats.contacted || 0 },
    { name: 'Converted', value: stats.converted || 0 }
  ];

  const sourceData = Object.entries(
    leads.reduce((acc, lead) => {
      const src = lead.source || 'Other';
      acc[src] = (acc[src] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '20px' }}>
      <div className="loader"></div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Initializing Intelligence...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="main-content"
    >
      <div className="dashboard-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.8rem' }}>Executive Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Advanced lead tracking & performance analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="glass-card" 
            style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              const data = JSON.stringify(leads, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `leads_report_${new Date().toLocaleDateString()}.json`;
              a.click();
            }}
          >
            <Download size={18} color="var(--primary)" />
            <span>Export Intel</span>
          </button>
          <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>System Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard title="Total Pipeline" value={stats.total} icon={<Users size={22} />} color="var(--primary)" trend="+12% this month" />
        <StatCard title="Qualified Leads" value={stats.new} icon={<Zap size={22} color="#3b82f6" />} color="#3b82f6" trend="+5% this week" />
        <StatCard title="Engagement" value={stats.contacted} icon={<Target size={22} color="#f59e0b" />} color="#f59e0b" trend="+8% today" />
        <StatCard title="Conversions" value={stats.converted} icon={<CheckCircle2 size={22} color="#10b981" />} color="#10b981" trend="+15% this month" />
      </div>

      {/* Charts Section */}
      <div className="grid-2-1">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} color="var(--primary)" />
              Lead Distribution by Source
            </h2>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ alignSelf: 'flex-start', marginBottom: '1.5rem' }}>Success Velocity</h2>
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell name="New" fill="#3b82f6" fillOpacity={0.9} />
                  <Cell name="Contacted" fill="#f59e0b" fillOpacity={0.9} />
                  <Cell name="Converted" fill="#10b981" fillOpacity={0.9} />
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{stats.successRate}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rate</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Current conversion efficiency is <span style={{ color: 'white', fontWeight: 600 }}>above average</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'new', 'contacted', 'converted'].map(s => (
              <button 
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn ${statusFilter === s ? 'btn-primary' : ''}`}
                style={{ 
                  background: statusFilter === s ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  fontSize: '0.85rem',
                  textTransform: 'capitalize'
                }}
              >
                {s}
              </button>
            ))}
          </div>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text" 
              placeholder="Intelligent search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                paddingLeft: '48px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px',
                fontSize: '1rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>PROSPECT IDENTITY</th>
                <th>ENGAGEMENT STATUS</th>
                <th>ORIGIN SOURCE</th>
                <th>CONTACT CHANNEL</th>
                <th>DATE ADDED</th>
                <th>MANAGEMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={lead.id} 
                  className="lead-row"
                >
                  <td style={{ cursor: 'pointer' }} onClick={() => setSelectedLead(lead)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {lead.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${lead.status}`} style={{ letterSpacing: '0.5px' }}>{lead.status}</span>
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
                            zIndex: 100, 
                            marginTop: '8px',
                            minWidth: '160px',
                            padding: '6px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                          }}
                        >
                          {['Website', 'LinkedIn', 'Referral', 'Cold Call'].map(src => (
                            <div 
                              key={src}
                              className="dropdown-item"
                              style={{ padding: '10px 14px', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem' }}
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
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <a href={`mailto:${lead.email}`} className="glass-card" style={{ padding: '8px' }}>
                        <Mail size={16} color="var(--primary)" />
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="glass-card" style={{ padding: '8px' }}>
                          <Phone size={16} color="#10b981" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {lead.createdAt ? new Date(lead.createdAt._seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
                      <div 
                        className="glass-card" 
                        style={{ 
                          padding: '8px 14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                        onClick={() => setActiveDropdown(activeDropdown === lead.id ? null : lead.id)}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{lead.status}</span>
                        <ChevronDown size={14} style={{ transform: activeDropdown === lead.id ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
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
                              zIndex: 100, 
                              marginTop: '8px',
                              minWidth: '140px',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                              padding: '6px'
                            }}
                          >
                            {['new', 'contacted', 'converted'].map(status => (
                              <div 
                                key={status}
                                className="dropdown-item"
                                style={{ 
                                  padding: '10px 14px', 
                                  cursor: 'pointer', 
                                  borderRadius: '8px',
                                  textTransform: 'capitalize',
                                  fontSize: '0.9rem',
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
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239, 68, 68, 0.6)', transition: '0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.6)'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative' }}
            >
              <button 
                onClick={() => setSelectedLead(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Trash2 size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '20px', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 700
                }}>
                  {selectedLead.name?.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem' }}>{selectedLead.name}</h2>
                  <div className={`badge badge-${selectedLead.status}`}>{selectedLead.status}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                  <p style={{ fontSize: '1.1rem', marginTop: '5px' }}>{selectedLead.email}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                  <p style={{ fontSize: '1.1rem', marginTop: '5px' }}>{selectedLead.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Acquisition Source</label>
                  <div style={{ marginTop: '5px' }}>
                    <SourceBadge source={selectedLead.source} />
                  </div>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>System ID</label>
                  <p style={{ fontSize: '0.9rem', marginTop: '5px', color: 'var(--text-muted)' }}>{selectedLead.id}</p>
                </div>
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', gap: '15px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
                  onClick={() => {
                    alert(`Briefing sent to ${selectedLead.email} successfully!`);
                    setSelectedLead(null);
                  }}
                >
                  <Mail size={18} /> Send Briefing
                </button>
                <button 
                  className="btn" 
                  style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)', padding: '14px' }}
                  onClick={() => setSelectedLead(null)}
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel stat-card" 
    style={{ 
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{ 
      position: 'absolute', 
      top: '-20px', 
      right: '-20px', 
      width: '100px', 
      height: '100px', 
      background: color, 
      opacity: 0.05, 
      borderRadius: '50%' 
    }}></div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <div style={{ 
        padding: '10px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: color, background: `${color}15`, padding: '4px 8px', borderRadius: '6px' }}>
        {trend}
      </div>
    </div>
    
    <div>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>{title}</span>
      <div className="stat-value" style={{ margin: '4px 0', fontSize: '2.2rem' }}>{value}</div>
    </div>
    
    <div style={{ 
      height: '3px', 
      width: '100%', 
      background: `linear-gradient(90deg, ${color}, transparent)`, 
      borderRadius: '2px',
      marginTop: '10px'
    }}></div>
  </motion.div>
);

export default Dashboard;
