import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function BottomNavMobile({
  currentView,
  setCurrentView,
  onOpenQuoteModal,
  onOpenClientPortal,
  onScrollToProducts,
}) {
  const getActiveTab = () => {
    if (currentView === 'admin') return 4;
    return 0;
  };

  return (
    <Paper
      sx={{
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
            onOpenQuoteModal();
          } else if (newValue === 2) {
            setCurrentView('public');
            setTimeout(onScrollToProducts, 100);
          } else if (newValue === 3) {
            onOpenClientPortal();
          } else if (newValue === 4) {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
        <BottomNavigationAction label="Cotizar" icon={<CalculateIcon sx={{ color: '#FF6F22' }} />} />
        <BottomNavigationAction label="Seguros" icon={<HealthAndSafetyIcon />} />
        <BottomNavigationAction label="Mi Póliza" icon={<VerifiedUserIcon sx={{ color: '#0B4F9C' }} />} />
        <BottomNavigationAction label="Gestión" icon={<DashboardIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
