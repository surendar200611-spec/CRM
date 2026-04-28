import { LayoutDashboard, UserPlus, LogOut, User, Settings, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('crm_authenticated');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="sidebar glass-panel" style={{ borderRadius: '0 24px 24px 0', borderLeft: 'none' }}>
      <div className="logo" style={{ padding: '10px 0', marginBottom: '1rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}>
            <ShieldCheck size={24} color="white" />
          </div>
          <h2 className="text-gradient" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>Quantum CRM</h2>
        </motion.div>
      </div>

      <div className="sidebar-profile" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '16px', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: 'var(--primary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'white'
        }}>
          S
        </div>
        <div className="profile-text">
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Surendar</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
            Admin Authority
          </div>
        </div>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '5px', paddingLeft: '12px' }}>Main Navigation</p>
        
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{ padding: '14px 18px' }}
        >
          <LayoutDashboard size={20} />
          <span style={{ fontWeight: 500 }}>Intelligence Center</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
          style={{ padding: '14px 18px' }}
        >
          <UserPlus size={20} />
          <span style={{ fontWeight: 500 }}>Acquire Lead</span>
        </div>

        <div 
          className="nav-item"
          style={{ padding: '14px 18px', opacity: 0.5, cursor: 'not-allowed' }}
        >
          <Settings size={20} />
          <span style={{ fontWeight: 500 }}>System Config</span>
        </div>
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
        <div className="nav-item" onClick={handleLogout} style={{ color: '#ef4444', padding: '14px 18px', background: 'rgba(239, 68, 68, 0.05)' }}>
          <LogOut size={20} />
          <span style={{ fontWeight: 600 }}>Terminate Session</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
