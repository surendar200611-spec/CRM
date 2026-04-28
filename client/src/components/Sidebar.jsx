import { LayoutDashboard, UserPlus, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

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
    <div className="sidebar glass-panel">
      <div className="logo">
        <h2 className="text-gradient">CRM</h2>
      </div>

      <div className="sidebar-profile" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '12px',
        marginBottom: '1rem'
      }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: 'var(--primary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <User size={16} color="white" />
        </div>
        <div className="profile-text">
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Surendar</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Admin</div>
        </div>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <UserPlus size={20} />
          <span>Add Lead</span>
        </div>
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <div className="nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
