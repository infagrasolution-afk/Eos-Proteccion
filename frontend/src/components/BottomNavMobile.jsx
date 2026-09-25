import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SendIcon from '@mui/icons-material/Send';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function BottomNavMobile({
  currentView,
  setCurrentView,
  onOpenClientPortal,
  currentUser,
  onOpenLoginModal,
}) {
  const getActiveTab = () => {
    if (currentView === 'admin') return 4;
    return 0;
  };

  const scrollTo = (id) => {
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Paper
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'background.paper',
      }}
      elevation={8}
    >
      <BottomNavigation
        showLabels
        value={getActiveTab()}
        onChange={(event, newValue) => {
          if (newValue === 0) {
            setCurrentView('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (newValue === 1) {
            scrollTo('servicios-coberturas');
          } else if (newValue === 2) {
            scrollTo('formulario-cotizacion');
          } else if (newValue === 3) {
            onOpenClientPortal();
          } else if (newValue === 4) {
            if (!currentUser) {
              onOpenLoginModal();
            } else {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
        <BottomNavigationAction label="Servicios" icon={<HealthAndSafetyIcon />} />
        <BottomNavigationAction label="Cotizar" icon={<SendIcon sx={{ color: '#FF6F22' }} />} />
        <BottomNavigationAction label="Mi Póliza" icon={<VerifiedUserIcon sx={{ color: '#0B4F9C' }} />} />
        <BottomNavigationAction
          label={currentUser ? 'CRM' : 'Ingreso'}
          icon={currentUser ? <DashboardIcon /> : <LockIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
